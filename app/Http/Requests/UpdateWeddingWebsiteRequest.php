<?php

namespace App\Http\Requests;

use App\Models\WeddingWebsite;

class UpdateWeddingWebsiteRequest extends WeddingContentRequest
{
    public function authorize(): bool
    {
        $website = $this->route('wedding_website');

        return $website instanceof WeddingWebsite && $this->user()?->id === $website->user_id;
    }
}
