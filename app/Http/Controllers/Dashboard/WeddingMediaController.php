<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\WeddingWebsite;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class WeddingMediaController extends Controller
{
    public function store(Request $request, WeddingWebsite $weddingWebsite): RedirectResponse
    {
        abort_unless($request->user()?->id === $weddingWebsite->user_id, 403);
        $request->validate([
            'kind' => ['required', Rule::in(['cover', 'partner_one', 'partner_two', 'gallery', 'music'])],
            'file' => $request->input('kind') === 'music'
                ? ['required', 'file', 'mimes:mp3,wav', 'max:10240']
                : ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
        ], [
            'file.max' => 'Ukuran file maksimal 10 MB.',
            'file.uploaded' => 'File gagal diterima server. Coba ulangi; jika tetap gagal, periksa batas unggahan dan folder sementara PHP.',
        ]);
        /** @var UploadedFile $file */
        $file = $request->file('file');
        $kind = $request->string('kind')->toString();
        $path = $file->store('weddings/'.$weddingWebsite->id, 'public');
        abort_unless(is_string($path), 500, 'File gagal disimpan.');
        try {
            $removed = DB::transaction(function () use ($weddingWebsite, $kind, $path): array {
                $locked = WeddingWebsite::query()->lockForUpdate()->findOrFail($weddingWebsite->id);
                $media = collect($locked->media ?? []);
                if ($kind === 'gallery' && $media->where('kind', 'gallery')->count() >= 12) {
                    throw ValidationException::withMessages(['file' => 'Maksimal 12 foto galeri. Hapus satu foto terlebih dahulu.']);
                }
                $removed = $kind === 'gallery' ? [] : $media->where('kind', $kind)->pluck('path')->all();
                if ($kind !== 'gallery') {
                    $media = $media->where('kind', '!=', $kind);
                }
                $locked->update(['media' => $media->push([
                    'id' => (string) Str::uuid(), 'kind' => $kind, 'path' => $path, 'url' => '/storage/'.$path,
                ])->values()->all()]);

                return $removed;
            });
        } catch (\Throwable $exception) {
            Storage::disk('public')->delete($path);
            throw $exception;
        }
        Storage::disk('public')->delete($removed);

        return back()->with('success', 'Media berhasil disimpan.');
    }

    public function destroy(Request $request, WeddingWebsite $weddingWebsite, string $media): RedirectResponse
    {
        abort_unless($request->user()?->id === $weddingWebsite->user_id, 403);
        $path = DB::transaction(function () use ($weddingWebsite, $media): string {
            $locked = WeddingWebsite::query()->lockForUpdate()->findOrFail($weddingWebsite->id);
            $items = collect($locked->media ?? []);
            $item = $items->firstWhere('id', $media);
            abort_if($item === null, 404);
            $locked->update(['media' => $items->where('id', '!=', $media)->values()->all()]);

            return $item['path'];
        });
        Storage::disk('public')->delete($path);

        return back()->with('success', 'Media dihapus.');
    }
}
