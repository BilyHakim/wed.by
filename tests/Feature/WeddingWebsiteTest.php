<?php

use App\Models\User;
use App\Models\WeddingWebsite;
use Inertia\Testing\AssertableInertia as Assert;

test('users only see their own wedding websites on the dashboard', function () {
    $user = User::factory()->create();
    $ownWebsite = WeddingWebsite::factory()->for($user)->create();
    $otherWebsite = WeddingWebsite::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('websites', 1)
            ->where('websites.0.id', $ownWebsite->id)
            ->missing('websites.1')
        );

    expect($ownWebsite->id)->not->toBe($otherWebsite->id);
});

test('a user can create a published wedding website', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('wedding-websites.store'), [
        'title' => 'Pernikahan Alya & Bima',
        'slug' => 'alya-dan-bima',
        'theme' => 'classic',
        'partner_one_name' => 'Alya',
        'partner_two_name' => 'Bima',
        'wedding_at' => '2027-01-15 10:00:00',
        'venue_name' => 'Gedung Bahagia',
        'venue_address' => 'Jakarta',
        'story' => 'Cerita kami.',
        'status' => 'published',
    ]);

    $website = WeddingWebsite::query()->sole();

    $response->assertRedirect(route('wedding-websites.edit', $website));
    expect($website->user_id)->toBe($user->id)
        ->and($website->published_at)->not->toBeNull();
});

test('users cannot edit another users wedding website', function () {
    $user = User::factory()->create();
    $website = WeddingWebsite::factory()->create();

    $this->actingAs($user)
        ->get(route('wedding-websites.edit', $website))
        ->assertForbidden();
});

test('draft websites are private and published websites are public', function () {
    $draft = WeddingWebsite::factory()->create();
    $published = WeddingWebsite::factory()->published()->create();

    $this->get(route('wedding.show', $draft))->assertNotFound();

    $this->get(route('wedding.show', $published))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('wedding/show')
            ->where('wedding.slug', $published->slug)
        );
});

test('website slugs must be unique', function () {
    $user = User::factory()->create();
    WeddingWebsite::factory()->create(['slug' => 'alya-dan-bima']);

    $this->actingAs($user)
        ->post(route('wedding-websites.store'), [
            'title' => 'Website lain',
            'slug' => 'alya-dan-bima',
            'theme' => 'garden',
            'partner_one_name' => 'Alya',
            'partner_two_name' => 'Bima',
            'status' => 'draft',
        ])
        ->assertSessionHasErrors('slug');
});
