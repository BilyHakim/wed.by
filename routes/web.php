<?php

use App\Http\Controllers\Dashboard\WeddingWebsiteController;
use App\Http\Controllers\PublicWeddingController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [WeddingWebsiteController::class, 'index'])->name('dashboard');
    Route::resource('wedding-websites', WeddingWebsiteController::class)
        ->except(['index', 'show']);
});

Route::get('w/{weddingWebsite:slug}', PublicWeddingController::class)
    ->name('wedding.show');

require __DIR__.'/settings.php';
