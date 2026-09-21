<?php

use App\Http\Controllers\Dashboard\WeddingGuestController;
use App\Http\Controllers\Dashboard\WeddingGuestQrController;
use App\Http\Controllers\Dashboard\WeddingMediaController;
use App\Http\Controllers\Dashboard\WeddingWebsiteController;
use App\Http\Controllers\PublicWeddingController;
use App\Http\Controllers\WeddingRsvpController;
use App\Http\Controllers\WeddingThemeController;
use App\Http\Controllers\WeddingWishController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::get('themes', [WeddingThemeController::class, 'index'])->name('themes.index');
Route::get('themes/{theme}', [WeddingThemeController::class, 'show'])->name('themes.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [WeddingWebsiteController::class, 'index'])->name('dashboard');
    Route::resource('wedding-websites', WeddingWebsiteController::class)
        ->except(['index', 'show']);
    Route::get('wedding-websites/{weddingWebsite}/preview', [WeddingWebsiteController::class, 'preview'])->name('wedding-websites.preview');
    Route::get('wedding-websites/{weddingWebsite}/guests', [WeddingGuestController::class, 'index'])->name('guests.index');
    Route::post('wedding-websites/{weddingWebsite}/guests', [WeddingGuestController::class, 'store'])->name('guests.store');
    Route::get('wedding-websites/{weddingWebsite}/guests/export', [WeddingGuestController::class, 'export'])->name('guests.export');
    Route::patch('guests/{guest}', [WeddingGuestController::class, 'update'])->name('guests.update');
    Route::get('guests/{guest}/qr', WeddingGuestQrController::class)->name('guests.qr');
    Route::delete('guests/{guest}', [WeddingGuestController::class, 'destroy'])->name('guests.destroy');
    Route::post('wedding-websites/{weddingWebsite}/media', [WeddingMediaController::class, 'store'])->name('media.store');
    Route::delete('wedding-websites/{weddingWebsite}/media/{media}', [WeddingMediaController::class, 'destroy'])->name('media.destroy');
});

Route::get('w/{weddingWebsite:slug}', PublicWeddingController::class)
    ->name('wedding.show');
Route::post('w/{weddingWebsite:slug}/rsvp', [WeddingRsvpController::class, 'store'])
    ->middleware('throttle:10,1')->name('wedding.rsvp');
Route::post('w/{weddingWebsite:slug}/wishes', [WeddingWishController::class, 'store'])
    ->middleware('throttle:10,1')->name('wedding.wishes');

require __DIR__.'/settings.php';
