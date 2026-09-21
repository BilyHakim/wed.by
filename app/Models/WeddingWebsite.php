<?php

namespace App\Models;

use Database\Factories\WeddingWebsiteFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $slug
 * @property string $theme
 * @property string $partner_one_name
 * @property string $partner_two_name
 * @property Carbon|null $wedding_at
 * @property string|null $venue_name
 * @property string|null $venue_address
 * @property string|null $story
 * @property string $status
 * @property Carbon|null $published_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'title',
    'slug',
    'theme',
    'partner_one_name',
    'partner_two_name',
    'wedding_at',
    'venue_name',
    'venue_address',
    'story',
    'status',
    'published_at',
])]
class WeddingWebsite extends Model
{
    /** @use HasFactory<WeddingWebsiteFactory> */
    use HasFactory;

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'wedding_at' => 'datetime',
            'published_at' => 'datetime',
        ];
    }
}
