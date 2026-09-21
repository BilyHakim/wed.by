<?php

namespace App\Http\Controllers;

use App\Models\WeddingWebsite;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WeddingRsvpController extends Controller
{
    public function store(Request $request, WeddingWebsite $weddingWebsite): RedirectResponse
    {
        abort_unless($weddingWebsite->status === 'published', 404);
        abort_unless($weddingWebsite->rsvp_enabled, 403, 'RSVP telah ditutup.');
        $request->validate(['token' => ['required', 'string', 'size:48']]);
        $guest = $weddingWebsite->guests()->where('token', $request->string('token')->toString())->firstOrFail();
        $data = $request->validate([
            'attendance' => ['required', Rule::in(['attending', 'declined'])],
            'attendees' => ['required', 'integer', 'min:0', 'max:'.$guest->pax, Rule::when($request->input('attendance') === 'attending', ['min:1'])],
            'message' => ['nullable', 'string', 'max:1000'],
        ]);
        $guest->update([
            ...$data,
            'attendees' => $data['attendance'] === 'declined' ? 0 : $data['attendees'],
            'responded_at' => now(),
            'message_approved' => array_key_exists('message', $data) ? false : $guest->message_approved,
        ]);

        return to_route('wedding.show', ['weddingWebsite' => $weddingWebsite->slug, 'guest' => $guest->token])
            ->with('success', 'Terima kasih. Konfirmasi kehadiran Anda berhasil disimpan.');
    }
}
