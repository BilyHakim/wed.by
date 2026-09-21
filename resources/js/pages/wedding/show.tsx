import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowLeft,
    CalendarDays,
    Copy,
    MapPin,
    Music2,
    Pause,
    Play,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { WeddingCover } from '@/components/wedding-cover';
import { index as themeIndex } from '@/routes/themes';
import { create } from '@/routes/wedding-websites';
import { rsvp, wishes as sendWish } from '@/routes/wedding';
import type { Wedding, WeddingEvent } from '@/types/wedding';
import { eventDate } from '@/types/wedding';

type Guest = {
    name: string;
    token: string;
    pax: number;
    attendance: string;
    attendees: number;
    message: string | null;
};
type Wish = { id: number; name: string; message: string };

function Countdown({ date }: { date: string | null }) {
    const [now, setNow] = useState<number | null>(null);
    useEffect(() => {
        const tick = () => setNow(Date.now());
        tick();
        const timer = window.setInterval(tick, 1000);
        return () => window.clearInterval(timer);
    }, []);
    if (!date || now === null) return null;
    const seconds = Math.max(
        0,
        Math.floor((new Date(date).getTime() - now) / 1000),
    );
    if (seconds === 0)
        return (
            <p className="mt-8 text-sm">
                Hari yang kami nantikan telah tiba. Terima kasih atas doa Anda.
            </p>
        );
    const units = [
        Math.floor(seconds / 86400),
        Math.floor(seconds / 3600) % 24,
        Math.floor(seconds / 60) % 60,
        seconds % 60,
    ];
    return (
        <div
            className="mt-10 flex justify-center gap-7 sm:gap-12"
            aria-label="Hitung mundur acara"
        >
            {units.map((value, index) => (
                <div key={index}>
                    <span className="block font-serif text-4xl tabular-nums">
                        {String(value).padStart(2, '0')}
                    </span>
                    <span className="mt-2 block text-[10px] tracking-widest uppercase">
                        {['Hari', 'Jam', 'Menit', 'Detik'][index]}
                    </span>
                </div>
            ))}
        </div>
    );
}

function calendarUrl(event: WeddingEvent) {
    const start = new Date(event.at);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const stamp = (date: Date) =>
        date
            .toISOString()
            .replace(/[-:]/g, '')
            .replace(/\.\d{3}/, '');
    return (
        'https://calendar.google.com/calendar/render?' +
        new URLSearchParams({
            action: 'TEMPLATE',
            text: event.name,
            dates: stamp(start) + '/' + stamp(end),
            location: [event.venue, event.address].filter(Boolean).join(', '),
        }).toString()
    );
}

function RsvpForm({ wedding, guest }: { wedding: Wedding; guest: Guest }) {
    const form = useForm({
        token: guest.token,
        attendance: guest.attendance === 'declined' ? 'declined' : 'attending',
        attendees: Math.max(guest.attendees, 1),
    });
    return (
        <form
            className="mt-8 space-y-5 text-left"
            onSubmit={(event) => {
                event.preventDefault();
                form.transform((data) => ({
                    ...data,
                    attendees:
                        data.attendance === 'declined' ? 0 : data.attendees,
                }));
                form.post(rsvp.url(wedding.slug), { preserveScroll: true });
            }}
        >
            <p className="text-sm">
                Konfirmasi untuk <strong>{guest.name}</strong> · maksimal{' '}
                {guest.pax} orang.
            </p>
            <label className="block text-sm">
                Kehadiran
                <select
                    className="wedding-input mt-2"
                    value={form.data.attendance}
                    onChange={(e) => form.setData('attendance', e.target.value)}
                >
                    <option value="attending">
                        Dengan senang hati, saya hadir
                    </option>
                    <option value="declined">
                        Maaf, saya belum bisa hadir
                    </option>
                </select>
            </label>
            {form.data.attendance === 'attending' && (
                <label className="block text-sm">
                    Jumlah yang hadir
                    <input
                        className="wedding-input mt-2"
                        type="number"
                        min={1}
                        max={guest.pax}
                        value={form.data.attendees}
                        onChange={(e) =>
                            form.setData('attendees', Number(e.target.value))
                        }
                        required
                    />
                </label>
            )}
            {Object.entries(form.errors).map(([field, message]) => (
                <p role="alert" className="text-sm text-red-600" key={field}>
                    {message}
                </p>
            ))}
            <button
                className="wedding-button w-full"
                disabled={form.processing}
            >
                {form.processing
                    ? 'Menyimpan…'
                    : guest.attendance === 'pending'
                      ? 'Kirim konfirmasi'
                      : 'Perbarui konfirmasi'}
            </button>
        </form>
    );
}

function WishForm({ wedding, guest }: { wedding: Wedding; guest: Guest }) {
    const form = useForm({ token: guest.token, message: guest.message ?? '' });
    return (
        <form
            className="mt-8 space-y-4"
            onSubmit={(event) => {
                event.preventDefault();
                form.post(sendWish.url(wedding.slug), { preserveScroll: true });
            }}
        >
            <label className="block text-sm">
                Doa dari {guest.name}
                <textarea
                    className="wedding-input mt-3"
                    rows={4}
                    required
                    maxLength={1000}
                    value={form.data.message}
                    onChange={(e) => form.setData('message', e.target.value)}
                    placeholder="Tuliskan harapan dan doa baik untuk pasangan…"
                />
            </label>
            {Object.entries(form.errors).map(([key, message]) => (
                <p key={key} role="alert" className="text-sm text-red-600">
                    {message}
                </p>
            ))}
            <button className="wedding-button" disabled={form.processing}>
                {form.processing
                    ? 'Menyimpan…'
                    : guest.message
                      ? 'Perbarui doa'
                      : 'Kirim doa'}
            </button>
            {form.recentlySuccessful && (
                <p role="status" className="text-sm">
                    Doa tersimpan. Terima kasih atas perhatian Anda.
                </p>
            )}
            <p className="text-xs opacity-65">
                Satu ucapan per tamu, dapat diperbarui. Ucapan baru atau
                perubahan akan ditinjau oleh pasangan sebelum tampil.
            </p>
        </form>
    );
}

export default function WeddingShow({
    wedding,
    guest = null,
    wishes = [],
    preview = false,
    demo = false,
    editUrl,
}: {
    wedding: Wedding;
    guest?: Guest | null;
    wishes?: Wish[];
    preview?: boolean;
    demo?: boolean;
    editUrl?: string;
}) {
    const content = wedding.content ?? {};
    const { success } = usePage().props;
    const [opened, setOpened] = useState(preview);
    const audio = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [musicError, setMusicError] = useState(false);
    const photos = wedding.media ?? [];
    const music = photos.find((item) => item.kind === 'music');
    const gallery = photos.filter((item) => item.kind === 'gallery');
    const events: WeddingEvent[] = [
        ...(wedding.wedding_at
            ? [
                  {
                      name: 'Pernikahan',
                      at: wedding.wedding_at,
                      venue: wedding.venue_name ?? '',
                      address: wedding.venue_address ?? '',
                      maps_url: content.maps_url ?? '',
                  },
              ]
            : []),
        ...(content.events ?? []),
    ];
    return (
        <main
            className="wedding-surface min-h-screen"
            data-theme={wedding.theme}
        >
            <Head title={wedding.title}>
                <meta
                    name="description"
                    content={`Undangan pernikahan ${wedding.partner_one_name} dan ${wedding.partner_two_name}.`}
                />
                <meta name="referrer" content="same-origin" />
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            {preview && (
                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#262821] px-5 py-3 text-xs text-white">
                    <Link
                        href={demo ? themeIndex() : (editUrl ?? themeIndex())}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft size={14} />
                        {demo ? 'Semua tema' : 'Kembali ke editor'}
                    </Link>
                    <span>
                        {demo
                            ? 'Contoh tema · data ilustrasi'
                            : 'Pratinjau privat · perubahan yang sudah disimpan'}
                    </span>
                    {demo && (
                        <Link
                            href={create({ query: { theme: wedding.theme } })}
                            className="underline underline-offset-4"
                        >
                            Gunakan tema ini
                        </Link>
                    )}
                </div>
            )}
            <WeddingCover wedding={wedding} />
            {!opened ? (
                <section className="mx-auto max-w-md px-6 py-12 text-center">
                    <p className="wedding-eyebrow">Kepada Yth.</p>
                    <p className="mt-4 font-serif text-3xl">
                        {guest?.name ?? 'Bapak / Ibu / Saudara / i'}
                    </p>
                    <p className="mt-3 text-xs opacity-60">
                        Dengan penuh hormat, kami mengundang Anda.
                    </p>
                    <button
                        className="wedding-button mt-8"
                        onClick={() => {
                            setOpened(true);
                            void audio.current
                                ?.play()
                                .catch(() => setPlaying(false));
                        }}
                    >
                        Buka undangan <ArrowDown size={14} />
                    </button>
                </section>
            ) : (
                <>
                    <section
                        className="wedding-section text-center"
                        id="pasangan"
                    >
                        <span className="wedding-eyebrow">
                            Dengan penuh rasa syukur
                        </span>
                        <p className="mx-auto mt-7 max-w-2xl text-sm">
                            {content.opening ||
                                'Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu di hari pernikahan kami.'}
                        </p>
                        <div className="mt-14 grid gap-12 md:grid-cols-2">
                            {[
                                {
                                    name:
                                        content.partner_one_full ||
                                        wedding.partner_one_name,
                                    parents: content.partner_one_parents,
                                    kind: 'partner_one',
                                },
                                {
                                    name:
                                        content.partner_two_full ||
                                        wedding.partner_two_name,
                                    parents: content.partner_two_parents,
                                    kind: 'partner_two',
                                },
                            ].map((partner) => {
                                const image = photos.find(
                                    (item) => item.kind === partner.kind,
                                );
                                return (
                                    <article key={partner.kind}>
                                        {image && (
                                            <img
                                                src={image.url}
                                                alt={partner.name}
                                                className="mx-auto mb-7 aspect-[3/4] w-52 object-cover"
                                                loading="lazy"
                                            />
                                        )}
                                        <h3>{partner.name}</h3>
                                        <p className="mt-3 text-sm whitespace-pre-line opacity-70">
                                            {partner.parents}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                        {content.quote && (
                            <blockquote className="mx-auto mt-16 max-w-2xl border-y border-current/20 py-8 font-serif text-xl italic">
                                “{content.quote}”
                                {content.quote_source && (
                                    <cite className="mt-4 block font-sans text-xs not-italic opacity-65">
                                        {content.quote_source}
                                    </cite>
                                )}
                            </blockquote>
                        )}
                    </section>
                    <section className="wedding-rule" id="acara">
                        <div className="wedding-section text-center">
                            <span className="wedding-eyebrow">
                                Save the date
                            </span>
                            <h2>Satu hari. Selamanya.</h2>
                            <Countdown date={wedding.wedding_at} />
                            <div className="mt-14 grid gap-12 md:grid-cols-2">
                                {events.length ? (
                                    events.map((event, index) => (
                                        <article
                                            key={index}
                                            className="border-t border-current/20 pt-8"
                                        >
                                            <span className="wedding-eyebrow">
                                                0{index + 1}
                                            </span>
                                            <h3 className="mt-4">
                                                {event.name}
                                            </h3>
                                            <p className="mt-4 text-sm">
                                                {eventDate(
                                                    event.at,
                                                    wedding.timezone,
                                                    true,
                                                )}
                                                <br />
                                                <span className="text-xs opacity-60">
                                                    {wedding.timezone ===
                                                    'Asia/Makassar'
                                                        ? 'WITA'
                                                        : wedding.timezone ===
                                                            'Asia/Jayapura'
                                                          ? 'WIT'
                                                          : 'WIB'}
                                                </span>
                                            </p>
                                            <p className="mt-5 font-medium">
                                                {event.venue}
                                            </p>
                                            <p className="mt-1 text-sm whitespace-pre-line opacity-70">
                                                {event.address}
                                            </p>
                                            <div className="mt-6 flex flex-wrap justify-center gap-3">
                                                {event.maps_url && (
                                                    <a
                                                        className="wedding-button wedding-button--outline"
                                                        href={event.maps_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        <MapPin size={14} />{' '}
                                                        Petunjuk arah
                                                    </a>
                                                )}
                                                <a
                                                    className="wedding-button wedding-button--outline"
                                                    href={calendarUrl(event)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <CalendarDays size={14} />{' '}
                                                    Simpan tanggal
                                                </a>
                                            </div>
                                        </article>
                                    ))
                                ) : (
                                    <p className="col-span-full text-sm">
                                        Detail acara akan segera diumumkan.
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>
                    {wedding.story && (
                        <section className="wedding-rule" id="cerita">
                            <div className="wedding-section grid gap-8 md:grid-cols-[1fr_1.5fr]">
                                <div>
                                    <span className="wedding-eyebrow">
                                        Our story
                                    </span>
                                    <h2>
                                        Jalan yang
                                        <br />
                                        mempertemukan.
                                    </h2>
                                </div>
                                <p className="text-sm whitespace-pre-line">
                                    {wedding.story}
                                </p>
                            </div>
                        </section>
                    )}
                    {(gallery.length > 0 || preview) && (
                        <section className="wedding-rule" id="galeri">
                            <div className="wedding-section">
                                <span className="wedding-eyebrow">
                                    A few of our favourite moments
                                </span>
                                <h2>Dalam bingkai.</h2>
                                {gallery.length === 0 && (
                                    <p className="mt-6 border border-dashed border-current/30 p-8 text-sm opacity-70">
                                        Foto galeri Anda akan tampil di sini.
                                        Unggah melalui editor → Foto & musik →
                                        Galeri. Tersedia di semua tema.
                                    </p>
                                )}
                                <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
                                    {gallery.map((photo, i) => (
                                        <a
                                            key={photo.id}
                                            href={photo.url}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <img
                                                src={photo.url}
                                                alt={`Momen bersama ${i + 1}`}
                                                className={`w-full object-cover ${i % 3 === 1 ? 'aspect-[3/4]' : 'aspect-square'}`}
                                                loading="lazy"
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                    <section className="wedding-rule" id="rsvp">
                        <div className="wedding-section max-w-xl text-center">
                            <span className="wedding-eyebrow">
                                Kindly reply
                            </span>
                            <h2>
                                Kami menantikan
                                <br />
                                kehadiran Anda.
                            </h2>
                            {typeof success === 'string' && (
                                <p
                                    role="status"
                                    className="mt-6 border border-current/20 p-4 text-sm"
                                >
                                    {success}
                                </p>
                            )}
                            {preview ? (
                                <p className="mt-8 text-sm opacity-70">
                                    Form konfirmasi tersedia untuk tamu melalui
                                    tautan undangan personal. RSVP tidak dikirim
                                    pada pratinjau.
                                </p>
                            ) : !wedding.rsvp_enabled ? (
                                <p className="mt-8 text-sm">
                                    Konfirmasi kehadiran telah ditutup. Terima
                                    kasih atas doa dan perhatian Anda.
                                </p>
                            ) : guest ? (
                                <RsvpForm wedding={wedding} guest={guest} />
                            ) : (
                                <p className="mt-8 text-sm opacity-70">
                                    Silakan buka tautan undangan personal yang
                                    dikirimkan oleh pasangan untuk mengonfirmasi
                                    kehadiran.
                                </p>
                            )}
                        </div>
                    </section>
                    {(content.gifts?.length ?? 0) > 0 && (
                        <section className="wedding-rule">
                            <div className="wedding-section text-center">
                                <span className="wedding-eyebrow">
                                    A little kindness
                                </span>
                                <h2>Tanda kasih.</h2>
                                <p className="mx-auto mt-5 max-w-xl text-sm opacity-70">
                                    Doa restu Anda sudah lebih dari cukup. Jika
                                    berkenan memberikan tanda kasih, berikut
                                    rekening kami.
                                </p>
                                <div className="mt-10 flex flex-wrap justify-center gap-8">
                                    {content.gifts?.map((gift, index) => (
                                        <div
                                            key={index}
                                            className="min-w-60 border border-current/20 p-7"
                                        >
                                            <p className="wedding-eyebrow">
                                                {gift.bank}
                                            </p>
                                            <p className="mt-4 font-serif text-2xl">
                                                {gift.number}
                                            </p>
                                            <p className="text-sm">
                                                {gift.holder}
                                            </p>
                                            <button
                                                className="wedding-button wedding-button--outline mt-5"
                                                onClick={() => {
                                                    void navigator.clipboard
                                                        .writeText(gift.number)
                                                        .then(() =>
                                                            toast.success(
                                                                'Nomor rekening disalin.',
                                                            ),
                                                        )
                                                        .catch(() =>
                                                            toast.error(
                                                                'Tidak bisa menyalin. Silakan salin nomor secara manual.',
                                                            ),
                                                        );
                                                }}
                                            >
                                                <Copy size={13} /> Salin nomor
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                    <section className="wedding-rule" id="doa">
                        <div className="wedding-section">
                            <span className="wedding-eyebrow">
                                Words to keep
                            </span>
                            <h2>Doa & ucapan.</h2>
                            {preview ? (
                                <p className="mt-6 text-sm opacity-70">
                                    Tamu dapat menulis doa melalui tautan
                                    personal atau QR undangan. Ucapan tampil
                                    setelah disetujui pasangan.
                                </p>
                            ) : guest ? (
                                <WishForm wedding={wedding} guest={guest} />
                            ) : (
                                <p className="mt-6 text-sm opacity-70">
                                    Buka tautan personal dari pasangan untuk
                                    menuliskan doa dan ucapan.
                                </p>
                            )}
                            {wishes.length === 0 && (
                                <p className="mt-8 text-sm italic opacity-60">
                                    Belum ada ucapan yang ditampilkan. Setiap
                                    doa baik begitu berarti bagi kami.
                                </p>
                            )}
                            <div className="mt-8 grid gap-x-10 md:grid-cols-2">
                                {wishes.map((wish) => (
                                    <blockquote
                                        key={wish.id}
                                        className="border-t border-current/20 py-6"
                                    >
                                        <p className="text-sm whitespace-pre-line">
                                            {wish.message}
                                        </p>
                                        <cite className="mt-3 block text-xs font-semibold not-italic">
                                            — {wish.name}
                                        </cite>
                                    </blockquote>
                                ))}
                            </div>
                        </div>
                    </section>
                    <footer className="wedding-section text-center">
                        <p className="mx-auto max-w-xl text-sm">
                            {content.closing ||
                                'Kehadiran dan doa restu Anda adalah hadiah terindah bagi kami.'}
                        </p>
                        <p className="mt-8 font-serif text-4xl">
                            {wedding.partner_one_name} &amp;{' '}
                            {wedding.partner_two_name}
                        </p>
                        <p className="mt-14 text-[10px] tracking-[.25em] uppercase">
                            Made with care · Wed.by
                        </p>
                    </footer>
                    {preview && !music && (
                        <p className="mx-auto mb-8 flex max-w-md items-center gap-3 px-6 text-xs opacity-70">
                            <Music2 size={18} className="shrink-0" />
                            Tambahkan lagu milik Anda melalui Foto & musik →
                            Musik latar. Kontrol putar tersedia di semua tema.
                        </p>
                    )}
                    <nav className="wedding-nav" aria-label="Bagian undangan">
                        <a href="#pasangan">Pasangan</a>
                        <a href="#acara">Acara</a>
                        {wedding.story && <a href="#cerita">Cerita</a>}
                        <a href="#rsvp">RSVP</a>
                        {(gallery.length > 0 || preview) && (
                            <a href="#galeri">Galeri</a>
                        )}
                        <a href="#doa">Doa</a>
                    </nav>
                </>
            )}
            {music && (
                <>
                    <audio
                        ref={audio}
                        src={music.url}
                        loop
                        preload="none"
                        onPlay={() => setPlaying(true)}
                        onPause={() => setPlaying(false)}
                        onError={() => {
                            setMusicError(true);
                            setPlaying(false);
                        }}
                        aria-label="Musik undangan"
                    />
                    {opened && (
                        <div className="fixed right-4 bottom-24 z-30 max-w-56">
                            <button
                                className="wedding-button shadow-lg"
                                aria-label={
                                    playing ? 'Jeda musik' : 'Putar musik'
                                }
                                aria-pressed={playing}
                                disabled={musicError}
                                onClick={() => {
                                    if (playing) audio.current?.pause();
                                    else
                                        void audio.current
                                            ?.play()
                                            .catch(() =>
                                                toast.error(
                                                    'Musik belum bisa diputar. Silakan coba lagi.',
                                                ),
                                            );
                                }}
                            >
                                {playing ? (
                                    <Pause size={16} />
                                ) : (
                                    <Play size={16} />
                                )}
                                <span>
                                    {musicError
                                        ? 'Musik tidak tersedia'
                                        : playing
                                          ? 'Jeda musik'
                                          : 'Putar musik'}
                                </span>
                            </button>
                        </div>
                    )}
                </>
            )}
        </main>
    );
}
