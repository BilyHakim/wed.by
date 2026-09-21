<?php

namespace App\Http\Controllers;

use App\Models\WeddingWebsite;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class PublicWeddingController extends Controller
{
    public function __invoke(Request $request, WeddingWebsite $weddingWebsite): Response
    {
        abort_unless($weddingWebsite->status === 'published', 404);
        $guest = null;
        if ($request->filled('guest')) {
            $guest = $weddingWebsite->guests()->where('token', $request->string('guest')->toString())->firstOrFail();
        }

        $response = Inertia::render('wedding/show', [
            'wedding' => $weddingWebsite->publicData(),
            'guest' => $guest?->only(['name', 'token', 'pax', 'attendance', 'attendees', 'message']),
            'wishes' => $weddingWebsite->guests()->where('message_approved', true)->whereNotNull('message')
                ->latest('responded_at')->limit(50)->get(['id', 'name', 'message']),
            'preview' => false,
        ])->toResponse($request);
        $response->headers->add(['Referrer-Policy' => 'same-origin', 'Cache-Control' => 'private, no-store']);

        return $response;
    }
}
