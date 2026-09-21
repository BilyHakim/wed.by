<?php

use App\Models\User;
use App\Models\WeddingGuest;
use App\Models\WeddingWebsite;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

test('every theme has a public demo and can be selected when creating a website', function (string $theme) {
    $this->get(route('themes.show', $theme))->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('wedding/show')->where('wedding.theme', $theme)->where('demo', true));
    $this->actingAs(User::factory()->create())->post(route('wedding-websites.store'), [
        'title' => 'Our wedding', 'slug' => 'our-wedding', 'theme' => $theme,
        'partner_one_name' => 'Alya', 'partner_two_name' => 'Bima', 'status' => 'draft',
        'timezone' => 'Asia/Makassar', 'wedding_at' => '2027-06-12T10:00',
        'content' => ['events' => [['name' => 'Resepsi', 'at' => '2027-06-12T12:00', 'venue' => 'Taman']]],
    ])->assertSessionHasNoErrors()->assertRedirect();
    $website = WeddingWebsite::query()->sole();
    expect($website->theme)->toBe($theme)
        ->and($website->wedding_at->format('H:i'))->toBe('02:00')
        ->and($website->content['events'][0]['at'])->toBe('2027-06-12T04:00:00+00:00');
})->with(['classic', 'garden', 'editorial', 'heritage', 'nocturne', 'terracotta']);

test('draft preview is owner only and does not publish the website', function () {
    $website = WeddingWebsite::factory()->create();
    $this->get(route('wedding-websites.preview', $website))->assertRedirect(route('login'));
    $this->actingAs(User::factory()->create())->get(route('wedding-websites.preview', $website))->assertForbidden();
    $this->actingAs($website->user)->get(route('wedding-websites.preview', $website))->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('preview', true)->missing('wedding.user_id'));
    $this->get(route('wedding.show', $website))->assertNotFound();
    expect($website->fresh()->status)->toBe('draft');
});

test('owner can update existing slug while unsafe nested content is rejected', function () {
    $website = WeddingWebsite::factory()->create();
    $data = $website->only(['title', 'slug', 'theme', 'partner_one_name', 'partner_two_name', 'status']);
    $this->actingAs($website->user)->put(route('wedding-websites.update', $website), $data)
        ->assertSessionHasNoErrors()->assertRedirect();
    $this->put(route('wedding-websites.update', $website), [...$data, 'content' => ['maps_url' => 'javascript:alert(1)']])
        ->assertSessionHasErrors('content.maps_url');
    $this->put(route('wedding-websites.update', $website), [...$data, 'content' => ['unexpected' => 'value']])
        ->assertSessionHasErrors('content');
});

test('bulk guests receive separate scoped links and private contact data stays private', function () {
    $website = WeddingWebsite::factory()->published()->create();
    $this->actingAs($website->user)->post(route('guests.store', $website), [
        'names' => "  Rina\nDoni\nRina", 'pax' => 2, 'group' => 'Keluarga',
    ])->assertSessionHasNoErrors()->assertRedirect();
    $guests = $website->guests()->get();
    expect($guests)->toHaveCount(2)->and($guests->pluck('token')->unique())->toHaveCount(2);
    $guest = $guests->first();
    $this->get(route('wedding.show', ['weddingWebsite' => $website, 'guest' => $guest->token]))->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('guest.name', 'Rina')->missing('guest.phone')->missing('guest.group')->missing('wedding.guests'));
    $other = WeddingWebsite::factory()->published()->create();
    $this->get(route('wedding.show', ['weddingWebsite' => $other, 'guest' => $guest->token]))->assertNotFound();
    $this->get(route('wedding.show', $website))->assertInertia(fn (Assert $page) => $page->where('guest', null));
});

test('rsvp enforces guest quota and resets approval whenever the message changes', function () {
    $website = WeddingWebsite::factory()->published()->create();
    $guest = WeddingGuest::factory()->for($website)->create(['pax' => 2]);
    $payload = ['token' => $guest->token, 'attendance' => 'attending', 'attendees' => 3, 'message' => 'Selamat!'];
    $this->post(route('wedding.rsvp', $website), $payload)->assertSessionHasErrors('attendees');
    expect($guest->fresh()->attendance)->toBe('pending');
    $this->post(route('wedding.rsvp', $website), [...$payload, 'attendees' => 2])->assertSessionHasNoErrors()->assertRedirect();
    expect($guest->fresh()->attendees)->toBe(2)->and($guest->fresh()->responded_at)->not->toBeNull();
    $this->get(route('wedding.show', $website))->assertInertia(fn (Assert $page) => $page->has('wishes', 0));
    $this->actingAs($website->user)->patch(route('guests.update', $guest), ['message_approved' => true])->assertRedirect();
    $this->get(route('wedding.show', $website))->assertInertia(fn (Assert $page) => $page->has('wishes', 1)->where('wishes.0.message', 'Selamat!'));
    $this->post(route('wedding.rsvp', $website), [...$payload, 'attendance' => 'declined', 'attendees' => 0, 'message' => 'Maaf belum bisa hadir'])->assertSessionHasNoErrors();
    expect($guest->fresh()->attendance)->toBe('declined')->and($guest->fresh()->attendees)->toBe(0)->and($guest->fresh()->message_approved)->toBeFalse();
});

test('rsvp rejects closed drafts and tokens belonging to another invitation', function () {
    $website = WeddingWebsite::factory()->published()->create();
    $guest = WeddingGuest::factory()->create();
    $data = ['token' => $guest->token, 'attendance' => 'attending', 'attendees' => 1];
    $this->post(route('wedding.rsvp', $website), $data)->assertNotFound();
    $website->update(['rsvp_enabled' => false]);
    $this->post(route('wedding.rsvp', $website), $data)->assertForbidden();
    $website->update(['status' => 'draft']);
    $this->post(route('wedding.rsvp', $website), $data)->assertNotFound();
    expect($guest->fresh()->attendance)->toBe('pending');
});

test('guest management and exports cannot cross owner boundaries', function () {
    $guest = WeddingGuest::factory()->create();
    $website = $guest->weddingWebsite;
    $this->actingAs(User::factory()->create());
    $this->get(route('guests.index', $website))->assertForbidden();
    $this->get(route('guests.export', $website))->assertForbidden();
    $this->post(route('guests.store', $website), ['names' => 'Intruder', 'pax' => 1])->assertForbidden();
    $this->patch(route('guests.update', $guest), ['checked_in' => true])->assertForbidden();
    $this->delete(route('guests.destroy', $guest))->assertForbidden();
    expect($guest->fresh()->checked_in_at)->toBeNull()->and($website->guests()->count())->toBe(1);
});

test('check in is idempotent and deleting a guest revokes their personal link', function () {
    $website = WeddingWebsite::factory()->published()->create();
    $guest = WeddingGuest::factory()->for($website)->create();
    $this->actingAs($website->user)->patch(route('guests.update', $guest), ['checked_in' => true])->assertRedirect();
    $first = $guest->fresh()->checked_in_at->toIso8601String();
    $this->travel(5)->minutes();
    $this->patch(route('guests.update', $guest), ['checked_in' => true])->assertRedirect();
    expect($guest->fresh()->checked_in_at->toIso8601String())->toBe($first);
    $this->patch(route('guests.update', $guest), ['checked_in' => false])->assertRedirect();
    expect($guest->fresh()->checked_in_at)->toBeNull();
    $this->delete(route('guests.destroy', $guest))->assertRedirect();
    $this->get(route('wedding.show', ['weddingWebsite' => $website, 'guest' => $guest->token]))->assertNotFound();
});

test('guest details can be corrected without changing their link or reducing confirmed seats', function () {
    $guest = WeddingGuest::factory()->create(['attendance' => 'attending', 'attendees' => 2, 'pax' => 3]);
    $token = $guest->token;
    $this->actingAs($guest->weddingWebsite->user)->patch(route('guests.update', $guest), [
        'name' => 'Rina & keluarga', 'phone' => '628123456789', 'group' => 'Keluarga', 'pax' => 4,
    ])->assertSessionHasNoErrors();
    expect($guest->fresh()->name)->toBe('Rina & keluarga')->and($guest->fresh()->token)->toBe($token)->and($guest->fresh()->pax)->toBe(4);
    $this->patch(route('guests.update', $guest), ['pax' => 1])->assertSessionHasErrors('pax');
    expect($guest->fresh()->pax)->toBe(4);
});

test('gallery capacity rejects extra files without leaving orphan uploads', function () {
    Storage::fake('public');
    $website = WeddingWebsite::factory()->create(['media' => collect(range(1, 12))->map(fn (int $number): array => [
        'id' => (string) $number, 'kind' => 'gallery', 'path' => 'weddings/photo-'.$number.'.jpg', 'url' => '/storage/weddings/photo-'.$number.'.jpg',
    ])->all()]);
    $this->actingAs($website->user)->post(route('media.store', $website), ['kind' => 'gallery', 'file' => UploadedFile::fake()->image('extra.jpg')])->assertSessionHasErrors('file');
    expect($website->fresh()->media)->toHaveCount(12)->and(Storage::disk('public')->allFiles())->toBe([]);
});

test('csv export neutralizes spreadsheet formulas and excludes other websites', function () {
    $guest = WeddingGuest::factory()->create(['name' => '=1+1', 'message' => '+cmd']);
    WeddingGuest::factory()->create(['name' => 'Private elsewhere']);
    $response = $this->actingAs($guest->weddingWebsite->user)->get(route('guests.export', $guest->weddingWebsite))->assertOk();
    expect($response->streamedContent())->toContain("'=1+1", "'+cmd")->not->toContain('Private elsewhere');
});

test('media can be uploaded replaced and deleted without leaking internal paths publicly', function () {
    Storage::fake('public');
    $website = WeddingWebsite::factory()->published()->create();
    $this->actingAs($website->user)->post(route('media.store', $website), ['kind' => 'cover', 'file' => UploadedFile::fake()->image('cover.jpg')])->assertSessionHasNoErrors();
    $first = $website->fresh()->media[0];
    Storage::disk('public')->assertExists($first['path']);
    $this->get(route('wedding.show', $website))->assertInertia(fn (Assert $page) => $page->has('wedding.media', 1)->missing('wedding.media.0.path'));
    $this->post(route('media.store', $website), ['kind' => 'cover', 'file' => UploadedFile::fake()->image('new.jpg')])->assertSessionHasNoErrors();
    $second = $website->fresh()->media[0];
    expect($website->fresh()->media)->toHaveCount(1);
    Storage::disk('public')->assertMissing($first['path']);
    $this->delete(route('media.destroy', [$website, $second['id']]))->assertRedirect();
    Storage::disk('public')->assertMissing($second['path']);
    expect($website->fresh()->media)->toBe([]);
});

test('uploads reject unsafe files and another owner cannot change media', function () {
    Storage::fake('public');
    $website = WeddingWebsite::factory()->create();
    $this->actingAs($website->user)->post(route('media.store', $website), ['kind' => 'cover', 'file' => UploadedFile::fake()->create('bad.svg', 1, 'image/svg+xml')])->assertSessionHasErrors('file');
    $this->actingAs(User::factory()->create())->post(route('media.store', $website), ['kind' => 'cover', 'file' => UploadedFile::fake()->image('cover.jpg')])->assertForbidden();
    $this->delete(route('media.destroy', [$website, 'unknown']))->assertForbidden();
    expect(Storage::disk('public')->allFiles())->toBe([]);
});

test('photos up to ten megabytes are accepted', function (int $size) {
    Storage::fake('public');
    $website = WeddingWebsite::factory()->create();

    $this->actingAs($website->user)->post(route('media.store', $website), [
        'kind' => 'gallery', 'file' => UploadedFile::fake()->image('photo.jpg')->size($size),
    ])->assertSessionHasNoErrors()->assertRedirect();

    expect($website->fresh()->media)->toHaveCount(1);
    Storage::disk('public')->assertExists($website->fresh()->media[0]['path']);
})->with([1024, 6144, 10240]);

test('files over ten megabytes are rejected without being stored', function (string $kind) {
    Storage::fake('public');
    $website = WeddingWebsite::factory()->create();

    $this->actingAs($website->user)->post(route('media.store', $website), [
        'kind' => $kind, 'file' => UploadedFile::fake()->image('too-large.jpg')->size(10241),
    ])->assertSessionHasErrors(['file' => 'Ukuran file maksimal 10 MB.']);

    expect($website->fresh()->media)->toBeNull();
    expect(Storage::disk('public')->allFiles())->toBe([]);
})->with(['gallery', 'cover']);

test('music accepts ten megabytes but rejects larger files', function () {
    Storage::fake('public');
    $website = WeddingWebsite::factory()->create();

    $this->actingAs($website->user)->post(route('media.store', $website), [
        'kind' => 'music', 'file' => UploadedFile::fake()->create('song.wav', 10240, 'audio/wav'),
    ])->assertSessionHasNoErrors();
    $path = $website->fresh()->media[0]['path'];
    Storage::disk('public')->assertExists($path);

    $this->post(route('media.store', $website), [
        'kind' => 'music', 'file' => UploadedFile::fake()->create('too-large.wav', 10241, 'audio/wav'),
    ])->assertSessionHasErrors(['file' => 'Ukuran file maksimal 10 MB.']);
    expect($website->fresh()->media[0]['path'])->toBe($path);
    expect(Storage::disk('public')->allFiles())->toHaveCount(1);
});

test('deleting a website removes its guest records and uploaded files', function () {
    Storage::fake('public');
    $guest = WeddingGuest::factory()->create();
    $website = $guest->weddingWebsite;
    $this->actingAs($website->user)->post(route('media.store', $website), ['kind' => 'gallery', 'file' => UploadedFile::fake()->image('memory.jpg')])->assertSessionHasNoErrors();
    $path = $website->fresh()->media[0]['path'];
    $this->delete(route('wedding-websites.destroy', $website))->assertRedirect(route('dashboard'));
    $this->assertModelMissing($website);
    $this->assertModelMissing($guest);
    Storage::disk('public')->assertMissing($path);
});
