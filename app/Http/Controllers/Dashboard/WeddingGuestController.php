<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\WeddingGuest;
use App\Models\WeddingWebsite;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class WeddingGuestController extends Controller
{
    public function index(Request $request, WeddingWebsite $weddingWebsite): Response
    {
        abort_unless($request->user()?->id === $weddingWebsite->user_id, 403);
        $search = mb_substr($request->string('search')->toString(), 0, 100);
        $guests = $weddingWebsite->guests()
            ->when($search !== '', fn ($query) => $query->whereLike('name', '%'.$search.'%'))
            ->latest('id')->paginate(30)->withQueryString();
        $guests->through(fn (WeddingGuest $guest): array => [
            ...$guest->toArray(),
            'invitation_url' => route('wedding.show', ['weddingWebsite' => $weddingWebsite->slug, 'guest' => $guest->token]),
        ]);

        return Inertia::render('wedding-websites/guests', [
            'website' => $weddingWebsite->only(['id', 'title', 'slug', 'status', 'qr_rsvp_enabled']),
            'guests' => $guests,
            'search' => $search,
            'stats' => [
                'total' => $weddingWebsite->guests()->count(),
                'confirmed' => $weddingWebsite->guests()->where('attendance', 'attending')->count(),
                'attendees' => (int) $weddingWebsite->guests()->where('attendance', 'attending')->sum('attendees'),
                'pending' => $weddingWebsite->guests()->where('attendance', 'pending')->count(),
                'checked_in' => $weddingWebsite->guests()->whereNotNull('checked_in_at')->count(),
            ],
        ]);
    }

    public function store(Request $request, WeddingWebsite $weddingWebsite): RedirectResponse
    {
        abort_unless($request->user()?->id === $weddingWebsite->user_id, 403);
        $data = $request->validate([
            'names' => ['required', 'string', 'max:10000'],
            'phone' => ['nullable', 'regex:/^[0-9+ ()-]{6,25}$/'],
            'group' => ['nullable', 'string', 'max:80'],
            'pax' => ['required', 'integer', 'min:1', 'max:20'],
        ]);
        $names = collect(preg_split('/\r\n|\r|\n/', $data['names']) ?: [])->map(fn (string $name): string => trim($name))->filter()->unique()->values();
        abort_if($names->isEmpty(), 422, 'Isi setidaknya satu nama tamu.');
        Validator::make(['names' => $names->all()], [
            'names' => ['array', 'max:100'], 'names.*' => ['string', 'max:100'],
        ])->validate();
        DB::transaction(function () use ($names, $weddingWebsite, $data): void {
            foreach ($names as $name) {
                $weddingWebsite->guests()->create([
                    'name' => $name, 'phone' => $names->count() === 1 ? ($data['phone'] ?? null) : null,
                    'group' => $data['group'] ?? null, 'pax' => $data['pax'],
                ]);
            }
        });

        return back()->with('success', $names->count().' tamu ditambahkan. Tautan personal siap dibagikan.');
    }

    public function update(Request $request, WeddingGuest $guest): RedirectResponse
    {
        abort_unless($request->user()?->id === $guest->weddingWebsite->user_id, 403);
        $data = $request->validate([
            'message_approved' => ['sometimes', 'boolean'],
            'checked_in' => ['sometimes', 'boolean'],
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'phone' => ['sometimes', 'nullable', 'string', 'regex:/^[0-9+ ()-]{6,25}$/'],
            'group' => ['sometimes', 'nullable', 'string', 'max:80'],
            'pax' => ['sometimes', 'required', 'integer', 'min:'.max(1, $guest->attendees), 'max:20'],
        ]);
        $guest->fill(Arr::only($data, ['name', 'phone', 'group', 'pax']));
        if (array_key_exists('message_approved', $data)) {
            $guest->message_approved = $data['message_approved'];
        }
        if (array_key_exists('checked_in', $data)) {
            $guest->checked_in_at = $data['checked_in'] ? ($guest->checked_in_at ?? now()) : null;
        }
        $guest->save();

        return back()->with('success', 'Data tamu diperbarui.');
    }

    public function destroy(Request $request, WeddingGuest $guest): RedirectResponse
    {
        abort_unless($request->user()?->id === $guest->weddingWebsite->user_id, 403);
        $guest->delete();

        return back()->with('success', 'Tamu dihapus. Tautan personalnya tidak berlaku lagi.');
    }

    public function export(Request $request, WeddingWebsite $weddingWebsite): StreamedResponse
    {
        abort_unless($request->user()?->id === $weddingWebsite->user_id, 403);

        return response()->streamDownload(function () use ($weddingWebsite): void {
            $stream = fopen('php://output', 'w');
            if ($stream === false) {
                return;
            }
            fwrite($stream, "\xEF\xBB\xBF");
            fputcsv($stream, ['Nama', 'Telepon', 'Grup', 'Kuota', 'RSVP', 'Jumlah hadir', 'Ucapan', 'Check-in'], ',', '"', '');
            foreach ($weddingWebsite->guests()->orderBy('id')->lazyById() as $guest) {
                $row = [$guest->name, $guest->phone ?? '', $guest->group ?? '', (string) $guest->pax,
                    $guest->attendance, (string) $guest->attendees, $guest->message ?? '', $guest->checked_in_at?->toIso8601String() ?? ''];
                fputcsv($stream, array_map(fn (string $value): string => preg_match('/^[\s]*[=+@-]/u', $value) ? "'".$value : $value, $row), ',', '"', '');
            }
            fclose($stream);
        }, 'tamu-'.$weddingWebsite->slug.'.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    }
}
