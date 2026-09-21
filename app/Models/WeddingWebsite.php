<?php

namespace App\Models;

use Database\Factories\WeddingWebsiteFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
 * @property string $timezone
 * @property array<string, mixed>|null $content
 * @property array<int, array{id: string, kind: string, path: string, url: string}>|null $media
 * @property bool $rsvp_enabled
 * @property bool $qr_rsvp_enabled
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
    'timezone', 'content', 'media', 'rsvp_enabled', 'qr_rsvp_enabled',
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

    /** @return HasMany<WeddingGuest, $this> */
    public function guests(): HasMany
    {
        return $this->hasMany(WeddingGuest::class);
    }

    /** @return array<string, mixed> */
    public function publicData(): array
    {
        return [
            ...$this->only(['title', 'slug', 'theme', 'partner_one_name', 'partner_two_name',
                'wedding_at', 'venue_name', 'venue_address', 'story', 'timezone', 'content', 'rsvp_enabled']),
            'media' => array_map(fn (array $item): array => [
                'id' => $item['id'], 'kind' => $item['kind'], 'url' => $item['url'],
            ], $this->media ?? []),
        ];
    }

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'wedding_at' => 'datetime',
            'published_at' => 'datetime',
            'content' => 'array',
            'media' => 'array',
            'rsvp_enabled' => 'boolean',
            'qr_rsvp_enabled' => 'boolean',
        ];
    }
}
