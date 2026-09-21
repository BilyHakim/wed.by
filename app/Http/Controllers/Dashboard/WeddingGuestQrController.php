<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\WeddingGuest;
use BaconQrCode\Common\ErrorCorrectionLevel;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WeddingGuestQrController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, WeddingGuest $guest): Response
    {
        $website = $guest->weddingWebsite;
        abort_unless($request->user()?->id === $website->user_id, 403);
        abort_unless($website->qr_rsvp_enabled, 404);

        $url = route('wedding.show', ['weddingWebsite' => $website->slug, 'guest' => $guest->token]);
        $writer = new Writer(new ImageRenderer(new RendererStyle(400, 4), new SvgImageBackEnd));
        $svg = $writer->writeString($url, 'UTF-8', ErrorCorrectionLevel::M());

        return response($svg, 200, [
            'Content-Type' => 'image/svg+xml',
            'Cache-Control' => 'private, no-store',
            'X-Content-Type-Options' => 'nosniff',
            'Content-Disposition' => ($request->boolean('download') ? 'attachment' : 'inline').'; filename="undangan-tamu-'.$guest->id.'.svg"',
        ]);
    }
}
