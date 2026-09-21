<?php

use App\Models\User;
use App\Models\WeddingGuest;
use App\Models\WeddingWebsite;
use BaconQrCode\Common\ErrorCorrectionLevel;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

test('qr is optional at creation and can be disabled without deleting guests', function () {
    $user = User::factory()->create();
    $data = ['title' => 'Our wedding', 'slug' => 'our-wedding', 'theme' => 'classic', 'partner_one_name' => 'Alya', 'partner_two_name' => 'Bima', 'status' => 'draft'];
    $this->actingAs($user)->post(route('wedding-websites.store'), $data)->assertSessionHasNoErrors();
    $website = WeddingWebsite::query()->sole();
    expect($website->qr_rsvp_enabled)->toBeFalse();

    $this->put(route('wedding-websites.update', $website), [...$data, 'qr_rsvp_enabled' => true])->assertSessionHasNoErrors();
    expect($website->fresh()->qr_rsvp_enabled)->toBeTrue();
    $this->post(route('guests.store', $website), ['names' => 'Rina', 'pax' => 2])->assertSessionHasNoErrors();
    $guest = $website->guests()->sole();
    $this->get(route('guests.qr', $guest))->assertOk();

    $this->put(route('wedding-websites.update', $website), [...$data, 'qr_rsvp_enabled' => false])->assertSessionHasNoErrors();
    $this->get(route('guests.qr', $guest))->assertNotFound();
    $this->assertModelExists($guest);
});

test('qr svg encodes the correct personal invitation without recording attendance', function () {
    $website = WeddingWebsite::factory()->published()->create(['qr_rsvp_enabled' => true, 'slug' => 'alya-bima']);
    $guest = WeddingGuest::factory()->for($website)->create();
    $writer = new Writer(new ImageRenderer(new RendererStyle(400, 4), new SvgImageBackEnd));
    $expected = $writer->writeString(url('/w/alya-bima').'?guest='.$guest->token, 'UTF-8', ErrorCorrectionLevel::M());

    $response = $this->actingAs($website->user)->get(route('guests.qr', $guest));
    $response->assertOk()->assertHeader('Content-Type', 'image/svg+xml');
    expect($response->getContent())->toBe($expected);
    expect($response->headers->get('Cache-Control'))->toContain('no-store');
    expect($guest->fresh()->attendance)->toBe('pending');
    expect($guest->fresh()->checked_in_at)->toBeNull();
    $this->get(route('guests.qr', ['guest' => $guest, 'download' => true]))->assertDownload('undangan-tamu-'.$guest->id.'.svg');
});

test('qr downloads require authentication ownership and an enabled website', function () {
    $guest = WeddingGuest::factory()->create();
    $this->get(route('guests.qr', $guest))->assertRedirect(route('login'));
    $this->actingAs(User::factory()->create())->get(route('guests.qr', $guest))->assertForbidden();
    $this->actingAs($guest->weddingWebsite->user)->get(route('guests.qr', $guest))->assertNotFound();
});

test('a guest can send a moderated wish even when rsvp is closed without changing attendance', function () {
    $website = WeddingWebsite::factory()->published()->create(['rsvp_enabled' => false]);
    $guest = WeddingGuest::factory()->for($website)->create(['attendance' => 'declined', 'attendees' => 0, 'message' => 'Old wish', 'message_approved' => true]);
    $this->post(route('wedding.wishes', $website), ['token' => $guest->token, 'message' => 'Semoga berbahagia', 'message_approved' => true, 'attendance' => 'attending', 'attendees' => 20])->assertSessionHasNoErrors()->assertRedirect();

    expect($guest->fresh()->message)->toBe('Semoga berbahagia');
    expect($guest->fresh()->message_approved)->toBeFalse();
    expect($guest->fresh()->attendance)->toBe('declined');
    expect($guest->fresh()->attendees)->toBe(0);
    $this->get(route('wedding.show', $website))->assertInertia(fn (Assert $page) => $page->has('wishes', 0));
});

test('wishes reject missing tokens invalid text and tokens from another website', function () {
    $website = WeddingWebsite::factory()->published()->create();
    $guest = WeddingGuest::factory()->for($website)->create();
    $otherGuest = WeddingGuest::factory()->create();
    $this->post(route('wedding.wishes', $website), ['message' => 'Hello'])->assertSessionHasErrors('token');
    $this->post(route('wedding.wishes', $website), ['token' => $guest->token, 'message' => ''])->assertSessionHasErrors('message');
    $this->post(route('wedding.wishes', $website), ['token' => $guest->token, 'message' => str_repeat('a', 1001)])->assertSessionHasErrors('message');
    $this->post(route('wedding.wishes', $website), ['token' => $otherGuest->token, 'message' => 'Hello'])->assertNotFound();
    $website->update(['status' => 'draft']);
    $this->post(route('wedding.wishes', $website), ['token' => $guest->token, 'message' => 'Hello'])->assertNotFound();
    expect($guest->fresh()->message)->toBeNull();
});

test('updating attendance alone does not erase or unapprove an existing wish', function () {
    $website = WeddingWebsite::factory()->published()->create();
    $guest = WeddingGuest::factory()->for($website)->create(['message' => 'Selamat!', 'message_approved' => true]);
    $this->post(route('wedding.rsvp', $website), ['token' => $guest->token, 'attendance' => 'attending', 'attendees' => 1])->assertSessionHasNoErrors();
    expect($guest->fresh()->attendees)->toBe(1);
    expect($guest->fresh()->message)->toBe('Selamat!');
    expect($guest->fresh()->message_approved)->toBeTrue();
});

test('every theme exposes its uploaded music gallery and approved wishes', function (string $theme) {
    $website = WeddingWebsite::factory()->published()->create(['theme' => $theme, 'media' => [
        ['id' => 'song', 'kind' => 'music', 'path' => 'weddings/song.mp3', 'url' => '/storage/weddings/song.mp3'],
        ['id' => 'photo', 'kind' => 'gallery', 'path' => 'weddings/photo.jpg', 'url' => '/storage/weddings/photo.jpg'],
    ]]);
    WeddingGuest::factory()->for($website)->create(['message' => 'Doa baik', 'message_approved' => true]);
    $this->get(route('wedding.show', $website))->assertInertia(fn (Assert $page) => $page
        ->component('wedding/show')->where('wedding.theme', $theme)
        ->where('wedding.media.0.kind', 'music')->where('wedding.media.1.kind', 'gallery')
        ->where('wishes.0.message', 'Doa baik')->missing('wedding.media.0.path'));
})->with(['classic', 'garden', 'editorial', 'heritage', 'nocturne', 'terracotta']);
