<?php

namespace App\Http\Controllers;

use App\Models\WeddingWebsite;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class WeddingWishController extends Controller
{
    public function store(Request $request, WeddingWebsite $weddingWebsite): RedirectResponse
    {
        abort_unless($weddingWebsite->status === 'published', 404);
        $data = $request->validate([
            'token' => ['required', 'string', 'size:48'],
            'message' => ['required', 'string', 'max:1000'],
        ]);
        $guest = $weddingWebsite->guests()->where('token', $data['token'])->firstOrFail();
        $guest->update(['message' => $data['message'], 'message_approved' => false]);

        return to_route('wedding.show', ['weddingWebsite' => $weddingWebsite->slug, 'guest' => $guest->token])
            ->with('success', 'Doa Anda tersimpan dan akan tampil setelah disetujui pasangan.');
    }
}
