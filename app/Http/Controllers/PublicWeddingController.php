<?php

namespace App\Http\Controllers;

use App\Models\WeddingWebsite;
use Inertia\Inertia;
use Inertia\Response;

class PublicWeddingController extends Controller
{
    public function __invoke(WeddingWebsite $weddingWebsite): Response
    {
        abort_unless($weddingWebsite->status === 'published', 404);

        return Inertia::render('wedding/show', [
            'wedding' => $weddingWebsite->only([
                'title',
                'slug',
                'theme',
                'partner_one_name',
                'partner_two_name',
                'wedding_at',
                'venue_name',
                'venue_address',
                'story',
            ]),
        ]);
    }
}
