<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WeddingContentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
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
            'slug' => ['required', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', 'max:100', Rule::unique('wedding_websites', 'slug')->ignore($this->route('wedding_website'))],
            'theme' => ['required', Rule::in(array_column(config('wedding.themes'), 'id'))],
            'partner_one_name' => ['required', 'string', 'max:100'],
            'partner_two_name' => ['required', 'string', 'max:100'],
            'wedding_at' => ['nullable', 'date'],
            'timezone' => ['sometimes', Rule::in(['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura'])],
            'venue_name' => ['nullable', 'string', 'max:150'],
            'venue_address' => ['nullable', 'string', 'max:1000'],
            'story' => ['nullable', 'string', 'max:5000'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'rsvp_enabled' => ['sometimes', 'boolean'],
            'qr_rsvp_enabled' => ['sometimes', 'boolean'],
            'content' => ['sometimes', 'array:opening,closing,partner_one_full,partner_two_full,partner_one_parents,partner_two_parents,quote,quote_source,maps_url,events,gifts'],
            'content.opening' => ['nullable', 'string', 'max:1500'],
            'content.closing' => ['nullable', 'string', 'max:1500'],
            'content.partner_one_full' => ['nullable', 'string', 'max:150'],
            'content.partner_two_full' => ['nullable', 'string', 'max:150'],
            'content.partner_one_parents' => ['nullable', 'string', 'max:250'],
            'content.partner_two_parents' => ['nullable', 'string', 'max:250'],
            'content.quote' => ['nullable', 'string', 'max:1500'],
            'content.quote_source' => ['nullable', 'string', 'max:150'],
            'content.maps_url' => ['nullable', 'url:http,https', 'max:2000'],
            'content.events' => ['sometimes', 'array', 'max:5'],
            'content.events.*' => ['array:name,at,venue,address,maps_url'],
            'content.events.*.name' => ['required', 'string', 'max:100'],
            'content.events.*.at' => ['required', 'date'],
            'content.events.*.venue' => ['required', 'string', 'max:150'],
            'content.events.*.address' => ['nullable', 'string', 'max:1000'],
            'content.events.*.maps_url' => ['nullable', 'url:http,https', 'max:2000'],
            'content.gifts' => ['sometimes', 'array', 'max:4'],
            'content.gifts.*' => ['array:bank,number,holder'],
            'content.gifts.*.bank' => ['required', 'string', 'max:80'],
            'content.gifts.*.number' => ['required', 'string', 'max:60'],
            'content.gifts.*.holder' => ['required', 'string', 'max:100'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return ['slug.regex' => 'Gunakan huruf kecil, angka, dan tanda hubung untuk alamat undangan.',
            'theme.in' => 'Tema yang dipilih tidak tersedia.'];
    }
}
