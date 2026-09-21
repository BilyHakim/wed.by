<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Database\Factories\WeddingGuestFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $wedding_website_id
 * @property string $name
 * @property string|null $phone
 * @property string|null $group
 * @property string $token
 * @property int $pax
 * @property string $attendance
 * @property int $attendees
 * @property string|null $message
 * @property bool $message_approved
 * @property CarbonInterface|null $responded_at
 * @property CarbonInterface|null $checked_in_at
 * @property WeddingWebsite $weddingWebsite
 */
#[Fillable(['name', 'phone', 'group', 'pax', 'attendance', 'attendees', 'message', 'message_approved', 'responded_at', 'checked_in_at'])]
class WeddingGuest extends Model
{
    /** @use HasFactory<WeddingGuestFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function (WeddingGuest $guest): void {
            $guest->token = Str::random(48);
        });
    }

    /** @return BelongsTo<WeddingWebsite, $this> */
    public function weddingWebsite(): BelongsTo
    {
        return $this->belongsTo(WeddingWebsite::class);
    }

    /** @return array<string, string> */
    protected function casts(): array
    {
        return ['pax' => 'integer', 'attendees' => 'integer', 'message_approved' => 'boolean',
            'responded_at' => 'datetime', 'checked_in_at' => 'datetime'];
    }
}
