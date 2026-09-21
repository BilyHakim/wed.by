<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\WeddingWebsite;
use Illuminate\Database\Seeder;

class WeddingWebsiteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::query()->first() ?? User::factory()->create();

        WeddingWebsite::factory()
            ->for($user)
            ->published()
            ->create([
                'title' => 'Pernikahan Alya & Bima',
                'slug' => 'alya-dan-bima',
                'partner_one_name' => 'Alya',
                'partner_two_name' => 'Bima',
            ]);
    }
}
