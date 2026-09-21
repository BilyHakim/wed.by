<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWeddingWebsiteRequest;
use App\Http\Requests\UpdateWeddingWebsiteRequest;
use App\Http\Requests\WeddingContentRequest;
use App\Models\WeddingWebsite;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class WeddingWebsiteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $websites = $request->user()
            ->weddingWebsites()
            ->latest()
            ->get([
                'id',
                'title',
                'slug',
                'theme',
                'partner_one_name',
                'partner_two_name',
                'wedding_at',
                'status',
                'updated_at',
                'timezone',
                'media',
                'venue_name',
            ]);

        return Inertia::render('dashboard', [
            'websites' => $websites,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('wedding-websites/create', [
            'themes' => $this->themes(),
            'selectedTheme' => in_array($request->input('theme'), array_column($this->themes(), 'id'), true) ? $request->input('theme') : 'classic',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWeddingWebsiteRequest $request): RedirectResponse
    {
        $attributes = $this->attributes($request);
        $attributes['published_at'] = $attributes['status'] === 'published' ? now() : null;

        $weddingWebsite = $request->user()->weddingWebsites()->create($attributes);

        return to_route('wedding-websites.edit', $weddingWebsite)
            ->with('success', 'Website undangan berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function edit(WeddingWebsite $weddingWebsite): Response
    {
        $this->ensureOwnedByCurrentUser($weddingWebsite);

        return Inertia::render('wedding-websites/edit', [
            'weddingWebsite' => $weddingWebsite,
            'themes' => $this->themes(),
            'uploadLimit' => UploadedFile::getMaxFilesize(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWeddingWebsiteRequest $request, WeddingWebsite $weddingWebsite): RedirectResponse
    {
        $attributes = $this->attributes($request);
        $attributes['published_at'] = $attributes['status'] === 'published'
            ? ($weddingWebsite->published_at ?? now())
            : null;

        $weddingWebsite->update($attributes);

        return back()->with('success', 'Perubahan berhasil disimpan.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WeddingWebsite $weddingWebsite): RedirectResponse
    {
        $this->ensureOwnedByCurrentUser($weddingWebsite);
        $paths = array_column($weddingWebsite->media ?? [], 'path');
        $weddingWebsite->delete();
        Storage::disk('public')->delete($paths);

        return to_route('dashboard')->with('success', 'Website undangan berhasil dihapus.');
    }

    /** @return array<int, array{id: string, name: string, description: string}> */
    private function themes(): array
    {
        return config('wedding.themes');
    }

    public function preview(Request $request, WeddingWebsite $weddingWebsite): \Symfony\Component\HttpFoundation\Response
    {
        $this->ensureOwnedByCurrentUser($weddingWebsite);

        $response = Inertia::render('wedding/show', [
            'wedding' => $weddingWebsite->publicData(), 'preview' => true, 'demo' => false,
            'guest' => null, 'wishes' => [], 'editUrl' => route('wedding-websites.edit', $weddingWebsite),
        ])->toResponse($request);
        $response->headers->set('Cache-Control', 'private, no-store');

        return $response;
    }

    /** @return array<string, mixed> */
    private function attributes(WeddingContentRequest $request): array
    {
        $data = $request->validated();
        $timezone = $data['timezone'] ?? 'Asia/Jakarta';
        if (! empty($data['wedding_at'])) {
            $data['wedding_at'] = Carbon::parse($data['wedding_at'], $timezone)->utc();
        }
        if (isset($data['content']['events'])) {
            foreach ($data['content']['events'] as &$event) {
                $event['at'] = Carbon::parse($event['at'], $timezone)->utc()->toIso8601String();
            }
        }

        return $data;
    }

    private function ensureOwnedByCurrentUser(WeddingWebsite $weddingWebsite): void
    {
        abort_unless($weddingWebsite->user_id === auth()->id(), 403);
    }
}
