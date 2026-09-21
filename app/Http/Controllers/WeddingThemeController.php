<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class WeddingThemeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('wedding/themes', ['themes' => config('wedding.themes')]);
    }

    public function show(string $theme): Response
    {
        abort_unless(in_array($theme, array_column(config('wedding.themes'), 'id'), true), 404);

        return Inertia::render('wedding/show', [
            'preview' => true, 'demo' => true, 'guest' => null, 'wishes' => [],
            'wedding' => [
                'title' => 'Alya & Bima', 'slug' => 'demo', 'theme' => $theme,
                'partner_one_name' => 'Alya', 'partner_two_name' => 'Bima',
                'wedding_at' => '2027-06-12T02:00:00Z', 'timezone' => 'Asia/Jakarta',
                'venue_name' => 'Pendopo Taman Sari', 'venue_address' => 'Yogyakarta, Indonesia',
                'story' => 'Kami bertemu di sebuah toko buku kecil, pada sore yang biasa saja. Percakapan tentang satu buku berlanjut menjadi perjalanan panjang. Kini, kami ingin memulai bab berikutnya bersama orang-orang yang kami sayangi.',
                'rsvp_enabled' => true, 'media' => [],
                'content' => [
                    'partner_one_full' => 'Alya Kirana', 'partner_two_full' => 'Bima Pradana',
                    'partner_one_parents' => 'Putri dari Bapak Hendra & Ibu Ratna',
                    'partner_two_parents' => 'Putra dari Bapak Surya & Ibu Dewi',
                    'opening' => 'Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan menjadi bagian dari hari pernikahan kami.',
                    'closing' => 'Kehadiran dan doa restu Anda adalah hadiah terindah bagi kami.',
                    'events' => [['name' => 'Resepsi', 'at' => '2027-06-12T04:00:00Z', 'venue' => 'Pendopo Taman Sari', 'address' => 'Yogyakarta', 'maps_url' => '']],
                    'gifts' => [],
                ],
            ],
        ]);
    }
}
