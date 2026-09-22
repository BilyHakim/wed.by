import type { Wedding } from '@/types/wedding';
import { eventDate } from '@/types/wedding';

export function WeddingCover({
    wedding,
    compact = false,
}: {
    wedding: Wedding;
    compact?: boolean;
}) {
    const cover = wedding.media?.find((item) => item.kind === 'cover');
    return (
        <div
            className={`invitation-cover ${compact ? 'invitation-cover--compact' : ''}`}
        >
            <div className="cover-ornament" aria-hidden="true" />
            <div className="flower-petals" aria-hidden="true">
                {Array.from({ length: 7 }, (_, index) => (
                    <span key={index} />
                ))}
            </div>
            <div className="cover-heading">
                <span className="wedding-eyebrow">
                    The wedding celebration of
                </span>
                <h1 className="cover-names">
                    <span>{wedding.partner_one_name}</span>
                    <i>&amp;</i>
                    <span>{wedding.partner_two_name}</span>
                </h1>
                <div className="cover-date">
                    {eventDate(wedding.wedding_at, wedding.timezone)}
                </div>
                <span className="cover-place">
                    {wedding.venue_name || 'Together with our families'}
                </span>
            </div>
            <div className={`cover-art ${cover ? 'has-photo' : ''}`}>
                {cover ? (
                    <img
                        src={cover.url}
                        alt={`${wedding.partner_one_name} dan ${wedding.partner_two_name}`}
                    />
                ) : (
                    <div className="cover-monogram" aria-hidden="true">
                        <span>{wedding.partner_one_name.charAt(0)}</span>
                        <i>/</i>
                        <span>{wedding.partner_two_name.charAt(0)}</span>
                    </div>
                )}
                <span className="cover-caption">a beginning, together.</span>
            </div>
        </div>
    );
}
