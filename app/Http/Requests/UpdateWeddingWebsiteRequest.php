<?php

namespace App\Http\Requests;

use App\Models\WeddingWebsite;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWeddingWebsiteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $weddingWebsite = $this->route('wedding_website');

        return $this->user() !== null
            && $weddingWebsite instanceof WeddingWebsite
            && $weddingWebsite->user_id === $this->user()->id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:100'],
            'slug' => [
                'required',
                'alpha_dash:ascii',
                'max:100',
                Rule::unique('wedding_websites', 'slug')->ignore($this->route('wedding_website')),
            ],
            'theme' => ['required', Rule::in(['classic', 'garden'])],
            'partner_one_name' => ['required', 'string', 'max:100'],
            'partner_two_name' => ['required', 'string', 'max:100'],
            'wedding_at' => ['nullable', 'date'],
            'venue_name' => ['nullable', 'string', 'max:150'],
            'venue_address' => ['nullable', 'string', 'max:1000'],
            'story' => ['nullable', 'string', 'max:5000'],
            'status' => ['required', Rule::in(['draft', 'published'])],
        ];
    }
}
