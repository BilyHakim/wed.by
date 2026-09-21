<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWeddingWebsiteRequest;
use App\Http\Requests\UpdateWeddingWebsiteRequest;
use App\Models\WeddingWebsite;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
            ]);

        return Inertia::render('dashboard', [
            'websites' => $websites,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('wedding-websites/create', [
            'themes' => $this->themes(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWeddingWebsiteRequest $request): RedirectResponse
    {
        $attributes = $request->validated();
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
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWeddingWebsiteRequest $request, WeddingWebsite $weddingWebsite): RedirectResponse
    {
        $attributes = $request->validated();
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
        $weddingWebsite->delete();

        return to_route('dashboard')->with('success', 'Website undangan berhasil dihapus.');
    }

    /** @return array<int, array{id: string, name: string, description: string}> */
    private function themes(): array
    {
        return [
            [
                'id' => 'classic',
                'name' => 'Classic',
                'description' => 'Elegan, hangat, dan fokus pada detail acara.',
            ],
            [
                'id' => 'garden',
                'name' => 'Garden',
                'description' => 'Segar dengan nuansa hijau dan tampilan natural.',
            ],
        ];
    }

    private function ensureOwnedByCurrentUser(WeddingWebsite $weddingWebsite): void
    {
        abort_unless($weddingWebsite->user_id === auth()->id(), 403);
    }
}
