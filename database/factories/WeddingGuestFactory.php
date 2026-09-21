<?php

namespace Database\Factories;

use App\Models\WeddingGuest;
use App\Models\WeddingWebsite;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WeddingGuest>
 */
class WeddingGuestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'wedding_website_id' => WeddingWebsite::factory(),
            'name' => fake()->name(),
            'pax' => 2,
        ];
    }
}
