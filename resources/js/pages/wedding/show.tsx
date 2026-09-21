import { Head } from '@inertiajs/react';
import { CalendarDays, Heart, MapPin } from 'lucide-react';

type Wedding = {
    title: string;
    slug: string;
    theme: 'classic' | 'garden';
    partner_one_name: string;
    partner_two_name: string;
    wedding_at: string | null;
    venue_name: string | null;
    venue_address: string | null;
    story: string | null;
};

export default function WeddingShow({ wedding }: { wedding: Wedding }) {
    const isGarden = wedding.theme === 'garden';
    const eventDate = wedding.wedding_at ? new Date(wedding.wedding_at) : null;

    return (
        <main
            className={`min-h-screen ${isGarden ? 'bg-[#f1f5ed] text-[#243526]' : 'bg-[#fffaf4] text-[#3f2924]'}`}
        >
            <Head title={wedding.title} />
            <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden px-6 py-20 text-center">
                <div
                    className={`absolute -top-32 -left-32 size-96 rounded-full blur-3xl ${isGarden ? 'bg-emerald-200/50' : 'bg-rose-200/50'}`}
                />
                <div
                    className={`absolute -right-32 -bottom-32 size-96 rounded-full blur-3xl ${isGarden ? 'bg-lime-200/50' : 'bg-amber-200/50'}`}
                />
                <div className="relative mx-auto max-w-3xl">
                    <Heart className="mx-auto mb-8 size-7" strokeWidth={1.5} />
                    <p className="mb-5 text-sm font-medium tracking-[0.3em] uppercase">
                        The Wedding Of
                    </p>
                    <h1 className="font-serif text-5xl leading-tight md:text-7xl">
                        {wedding.partner_one_name}{' '}
                        <span className="block py-2 text-3xl italic md:text-4xl">
                            &amp;
                        </span>{' '}
                        {wedding.partner_two_name}
                    </h1>
                    {eventDate && (
                        <p className="mt-8 text-base tracking-widest uppercase">
                            {new Intl.DateTimeFormat('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            }).format(eventDate)}
                        </p>
                    )}
                </div>
            </section>

            <section className="mx-auto grid max-w-4xl gap-6 px-6 py-20 md:grid-cols-2">
                <div className="rounded-3xl bg-white/70 p-8 text-center shadow-sm backdrop-blur">
                    <CalendarDays className="mx-auto mb-4 size-6" />
                    <h2 className="font-serif text-2xl">Waktu Acara</h2>
                    <p className="mt-3 text-sm leading-7 opacity-75">
                        {eventDate
                            ? new Intl.DateTimeFormat('id-ID', {
                                  dateStyle: 'full',
                                  timeStyle: 'short',
                              }).format(eventDate)
                            : 'Akan segera diumumkan'}
                    </p>
                </div>
                <div className="rounded-3xl bg-white/70 p-8 text-center shadow-sm backdrop-blur">
                    <MapPin className="mx-auto mb-4 size-6" />
                    <h2 className="font-serif text-2xl">Lokasi</h2>
                    <p className="mt-3 font-medium">
                        {wedding.venue_name ?? 'Akan segera diumumkan'}
                    </p>
                    {wedding.venue_address && (
                        <p className="mt-2 text-sm leading-6 opacity-75">
                            {wedding.venue_address}
                        </p>
                    )}
                </div>
            </section>

            {wedding.story && (
                <section className="mx-auto max-w-3xl px-6 py-20 text-center">
                    <p className="text-sm font-medium tracking-[0.3em] uppercase">
                        Cerita Kami
                    </p>
                    <h2 className="mt-4 font-serif text-4xl">
                        Sebuah perjalanan menuju hari bahagia
                    </h2>
                    <p className="mt-8 leading-8 whitespace-pre-line opacity-80">
                        {wedding.story}
                    </p>
                </section>
            )}

            <footer className="px-6 py-12 text-center text-sm opacity-60">
                {wedding.partner_one_name} &amp; {wedding.partner_two_name}
            </footer>
        </main>
    );
}
