<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\WeddingWebsite;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WeddingWebsite>
 */
class WeddingWebsiteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->words(3, true),
            'slug' => fake()->unique()->slug(),
            'theme' => fake()->randomElement(['classic', 'garden']),
            'partner_one_name' => fake()->firstName(),
            'partner_two_name' => fake()->firstName(),
            'wedding_at' => fake()->dateTimeBetween('+1 month', '+1 year'),
            'venue_name' => fake()->company(),
            'venue_address' => fake()->address(),
            'story' => fake()->paragraph(),
            'status' => 'draft',
            'published_at' => null,
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => now(),
        ]);
    }
}
