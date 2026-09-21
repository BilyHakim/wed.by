export type WeddingTheme = {
    id: string;
    name: string;
    description: string;
    category: string;
};
export type WeddingEvent = {
    name: string;
    at: string;
    venue: string;
    address: string;
    maps_url: string;
};
export type WeddingGift = { bank: string; number: string; holder: string };
export type WeddingContent = {
    opening: string;
    closing: string;
    partner_one_full: string;
    partner_two_full: string;
    partner_one_parents: string;
    partner_two_parents: string;
    quote: string;
    quote_source: string;
    maps_url: string;
    events: WeddingEvent[];
    gifts: WeddingGift[];
};
export type WeddingMedia = { id: string; kind: string; url: string };
export type Wedding = {
    id?: number;
    title: string;
    slug: string;
    theme: string;
    partner_one_name: string;
    partner_two_name: string;
    wedding_at: string | null;
    timezone: string;
    venue_name: string | null;
    venue_address: string | null;
    story: string | null;
    status?: 'draft' | 'published';
    content: Partial<WeddingContent> | null;
    media: WeddingMedia[] | null;
    rsvp_enabled: boolean;
    qr_rsvp_enabled?: boolean;
};

export function eventDate(
    value: string | null,
    timezone = 'Asia/Jakarta',
    withTime = false,
) {
    if (!value) return 'Tanggal akan diumumkan';
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
        ...(withTime ? { timeStyle: 'short' as const } : {}),
        timeZone: timezone,
    }).format(new Date(value));
}

export function localDateInput(
    value: string | null | undefined,
    timezone: string,
) {
    if (!value) return '';
    const parts = new Intl.DateTimeFormat('sv-SE', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).format(new Date(value));
    return parts.replace(' ', 'T');
}
