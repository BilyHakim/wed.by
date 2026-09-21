import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { WeddingCover } from '@/components/wedding-cover';
import { home } from '@/routes';
import { show } from '@/routes/themes';
import { create } from '@/routes/wedding-websites';
import type { WeddingTheme, Wedding } from '@/types/wedding';

export default function Themes({ themes }: { themes: WeddingTheme[] }) {
    const sample: Wedding = {
        title: 'Alya & Bima',
        slug: 'demo',
        theme: 'classic',
        partner_one_name: 'Alya',
        partner_two_name: 'Bima',
        wedding_at: '2027-06-12T02:00:00Z',
        timezone: 'Asia/Jakarta',
        venue_name: 'Yogyakarta',
        venue_address: null,
        story: null,
        media: [],
        content: {},
        rsvp_enabled: true,
    };
    return (
        <div className="min-h-screen bg-[#f7f5f0] text-[#30342e]">
            <Head title="Koleksi tema" />
            <header className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#30342e]/20 px-6 py-6">
                <Link href={home()} className="font-serif text-2xl">
                    wed.by
                </Link>
                <Link href={home()} className="flex items-center gap-2 text-sm">
                    <ArrowLeft size={16} /> Beranda
                </Link>
            </header>
            <main className="mx-auto max-w-7xl px-6 py-16">
                <p className="text-xs tracking-[.25em] uppercase">
                    The invitation collection / 01—06
                </p>
                <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-tight md:text-7xl">
                    Sebuah undangan.
                    <br />
                    <i>Seutuhnya kalian.</i>
                </h1>
                <p className="mt-6 max-w-xl text-sm leading-7 opacity-70">
                    Enam pendekatan desain, dari surat klasik sampai halaman
                    editorial. Jelajahi contoh lengkap sebelum memilih. Semua
                    tema mendukung foto, acara, galeri, amplop digital, dan
                    RSVP.
                </p>
                <div className="mt-14 grid gap-x-7 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
                    {themes.map((theme, index) => (
                        <article key={theme.id}>
                            <Link
                                href={show(theme.id)}
                                aria-label={`Lihat contoh ${theme.name}`}
                                className="wedding-surface block border border-black/10"
                                data-theme={theme.id}
                            >
                                <WeddingCover
                                    wedding={{ ...sample, theme: theme.id }}
                                    compact
                                />
                            </Link>
                            <div className="mt-5 flex justify-between">
                                <h2 className="font-serif text-2xl">
                                    {theme.name}
                                </h2>
                                <span className="text-xs opacity-50">
                                    0{index + 1} / {theme.category}
                                </span>
                            </div>
                            <p className="mt-2 min-h-12 text-sm leading-6 opacity-65">
                                {theme.description}
                            </p>
                            <div className="mt-4 flex gap-5 text-sm">
                                <Link
                                    href={show(theme.id)}
                                    className="border-b border-current pb-1"
                                >
                                    Lihat contoh
                                </Link>
                                <Link
                                    href={create({
                                        query: { theme: theme.id },
                                    })}
                                    className="flex items-center gap-2"
                                >
                                    Gunakan tema <ArrowUpRight size={14} />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
            <footer className="border-t border-black/10 px-6 py-8 text-center text-xs opacity-60">
                Dirancang untuk cerita yang berbeda. Wed.by.
            </footer>
        </div>
    );
}
