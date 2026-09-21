import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    Clock3,
    Heart,
    LayoutTemplate,
    Link2,
    Palette,
    Sparkles,
} from 'lucide-react';
import { dashboard, login, register } from '@/routes';
import { index as themes, show as themeShow } from '@/routes/themes';
import { WeddingCover } from '@/components/wedding-cover';

const features = [
    {
        icon: LayoutTemplate,
        title: 'Mudah dibuat',
        description:
            'Isi detail acara melalui dashboard yang sederhana, tanpa perlu mengerti coding.',
    },
    {
        icon: Palette,
        title: 'Tema elegan',
        description:
            'Pilih tampilan yang paling cocok dengan suasana hari spesial kalian.',
    },
    {
        icon: Link2,
        title: 'Siap dibagikan',
        description:
            'Publish undangan dan bagikan tautannya langsung kepada keluarga dan sahabat.',
    },
];

export default function Welcome() {
    const { auth } = usePage().props;
    const primaryLink = auth.user ? dashboard() : register();

    return (
        <>
            <Head title="Undangan digital untuk hari bahagiamu">
                <meta
                    name="description"
                    content="Buat website undangan pernikahan yang cantik, praktis, dan mudah dibagikan bersama Wed.by."
                />
            </Head>

            <div className="min-h-screen overflow-hidden bg-[#fbf8f3] text-[#29241f]">
                <header className="relative z-20 border-b border-[#ded5c9]/70 bg-[#fbf8f3]/90 backdrop-blur-xl">
                    <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
                        <Link href="/" className="flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-full bg-[#47624d] text-white shadow-sm">
                                <Heart className="size-5 fill-current" />
                            </span>
                            <span className="font-serif text-2xl font-semibold tracking-tight">
                                Wed<span className="text-[#9b6557]">.by</span>
                            </span>
                        </Link>

                        <div className="hidden items-center gap-8 text-sm text-[#6d645b] md:flex">
                            <a
                                href="#fitur"
                                className="transition hover:text-[#29241f]"
                            >
                                Fitur
                            </a>
                            <a
                                href="#tema"
                                className="transition hover:text-[#29241f]"
                            >
                                Tema
                            </a>
                            <a
                                href="#cara-kerja"
                                className="transition hover:text-[#29241f]"
                            >
                                Cara kerja
                            </a>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-full bg-[#2f4936] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#243b2b]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="hidden px-4 py-2.5 text-sm font-medium sm:block"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="rounded-full bg-[#2f4936] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#243b2b]"
                                    >
                                        Mulai gratis
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <main>
                    <section className="relative">
                        <div className="absolute top-0 left-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#e9d4cb]/50 blur-3xl" />
                        <div className="absolute right-0 bottom-0 h-[30rem] w-[30rem] translate-x-1/3 rounded-full bg-[#cad8c7]/60 blur-3xl" />

                        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-28">
                            <div className="max-w-2xl">
                                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ded5c9] bg-white/70 px-4 py-2 text-xs font-medium tracking-wide text-[#6f5b51] uppercase shadow-sm">
                                    <Sparkles className="size-3.5" />
                                    Undangan digital yang berkesan
                                </div>
                                <h1 className="font-serif text-5xl leading-[1.08] font-medium tracking-tight sm:text-6xl lg:text-7xl">
                                    Cerita indahmu,
                                    <span className="block text-[#8c5a4e] italic">
                                        dalam satu undangan.
                                    </span>
                                </h1>
                                <p className="mt-7 max-w-xl text-base leading-8 text-[#71685f] sm:text-lg">
                                    Buat website undangan pernikahan yang
                                    cantik, personal, dan mudah dibagikan. Cukup
                                    isi cerita kalian, pilih tema, lalu publish.
                                </p>

                                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                    <Link
                                        href={primaryLink}
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2f4936] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#2f4936]/15 transition hover:-translate-y-0.5 hover:bg-[#243b2b]"
                                    >
                                        {auth.user
                                            ? 'Buka dashboard'
                                            : 'Buat undangan sekarang'}
                                        <ArrowRight className="size-4" />
                                    </Link>
                                    <a
                                        href="#tema"
                                        className="inline-flex items-center justify-center rounded-full border border-[#d5cbc0] bg-white/60 px-7 py-3.5 text-sm font-semibold transition hover:bg-white"
                                    >
                                        Lihat pilihan tema
                                    </a>
                                </div>

                                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#71685f]">
                                    <span className="flex items-center gap-2">
                                        <Check className="size-4 text-[#52705a]" />{' '}
                                        Mudah digunakan
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Check className="size-4 text-[#52705a]" />{' '}
                                        Siap dalam hitungan menit
                                    </span>
                                </div>
                            </div>

                            <div className="relative mx-auto flex w-full max-w-2xl flex-col gap-4 lg:mx-0">
                                <div className="flex w-fit items-center gap-3 self-end rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
                                    <span className="flex size-9 items-center justify-center rounded-full bg-[#eef4ed]">
                                        <Clock3 className="size-4 text-[#47624d]" />
                                    </span>
                                    <div>
                                        <p className="font-semibold">
                                            Cepat & praktis
                                        </p>
                                        <p className="text-xs text-[#81776d]">
                                            Publish kapan saja
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-[2rem] border border-white/80 bg-white/50 p-3 shadow-2xl shadow-[#564b42]/15 backdrop-blur-sm sm:p-5">
                                    <div className="overflow-hidden rounded-[1.5rem] border border-[#e5ddd4] bg-[#fffaf4]">
                                        <div className="flex h-10 items-center gap-2 border-b border-[#e8e0d8] bg-white px-4">
                                            <span className="size-2.5 rounded-full bg-[#df9a91]" />
                                            <span className="size-2.5 rounded-full bg-[#e7c388]" />
                                            <span className="size-2.5 rounded-full bg-[#8cad8f]" />
                                            <div className="mx-auto rounded-full bg-[#f4f0eb] px-10 py-1 text-[10px] text-[#91867c] sm:px-20">
                                                wed.by/w/alya-dan-bima
                                            </div>
                                        </div>
                                        <div className="relative flex min-h-[31rem] items-center justify-center overflow-hidden px-6 py-16 text-center sm:min-h-[35rem]">
                                            <div className="absolute -top-24 -left-20 size-64 rounded-full bg-rose-100/80 blur-3xl" />
                                            <div className="absolute -right-16 -bottom-20 size-64 rounded-full bg-amber-100/90 blur-3xl" />
                                            <div className="relative">
                                                <Heart
                                                    className="mx-auto mb-8 size-6 text-[#925f55]"
                                                    strokeWidth={1.5}
                                                />
                                                <p className="text-xs font-semibold tracking-[0.35em] text-[#806d64] uppercase">
                                                    The Wedding Of
                                                </p>
                                                <p className="mt-7 font-serif text-5xl text-[#4a302b] sm:text-6xl">
                                                    Alya
                                                    <span className="block py-2 text-3xl italic">
                                                        &amp;
                                                    </span>
                                                    Bima
                                                </p>
                                                <div className="mx-auto mt-7 h-px w-16 bg-[#b99b8d]" />
                                                <p className="mt-6 text-xs tracking-[0.2em] text-[#806d64] uppercase">
                                                    15 Januari 2027
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-fit rounded-2xl bg-[#2f4936] px-5 py-4 text-white shadow-sm">
                                    <p className="text-xs text-white/70">
                                        Status undangan
                                    </p>
                                    <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                                        <span className="size-2 rounded-full bg-[#a9d3ad]" />{' '}
                                        Published
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="fitur" className="bg-white py-24 sm:py-28">
                        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                            <div className="mx-auto max-w-2xl text-center">
                                <p className="text-sm font-semibold tracking-[0.2em] text-[#8c5a4e] uppercase">
                                    Semua jadi lebih sederhana
                                </p>
                                <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                                    Fokus pada momen bahagia, biar kami urus
                                    undangannya.
                                </h2>
                            </div>

                            <div className="mt-16 grid gap-5 md:grid-cols-3">
                                {features.map((feature) => (
                                    <div
                                        key={feature.title}
                                        className="rounded-3xl border border-[#e8e1d9] bg-[#fcfaf7] p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/5"
                                    >
                                        <span className="flex size-12 items-center justify-center rounded-2xl bg-[#e8efe7] text-[#3f5d46]">
                                            <feature.icon className="size-5" />
                                        </span>
                                        <h3 className="mt-6 text-lg font-semibold">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-3 text-sm leading-7 text-[#756c63]">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="tema" className="py-24 sm:py-28">
                        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                                <div className="max-w-2xl">
                                    <p className="text-sm font-semibold tracking-[0.2em] text-[#8c5a4e] uppercase">
                                        Pilihan tema
                                    </p>
                                    <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
                                        Tampilan cantik untuk setiap cerita.
                                    </h2>
                                </div>
                                <p className="max-w-md text-sm leading-7 text-[#756c63]">
                                    Mulai dengan tema yang tersedia dan ganti
                                    kapan saja dari dashboard.
                                    <Link
                                        href={themes()}
                                        className="mt-3 block font-semibold underline underline-offset-4"
                                    >
                                        Jelajahi 6 tema & demo interaktif →
                                    </Link>
                                </p>
                            </div>

                            <div className="mt-14 grid gap-6 md:grid-cols-3">
                                {[
                                    ['classic', 'Ivory Letter'],
                                    ['garden', 'Botanical'],
                                    ['editorial', 'The Editorial'],
                                ].map(([id, name]) => (
                                    <Link
                                        key={id}
                                        href={themeShow(id)}
                                        className="overflow-hidden border border-[#ded5c9]"
                                    >
                                        <div
                                            className="wedding-surface"
                                            data-theme={id}
                                        >
                                            <WeddingCover
                                                compact
                                                wedding={{
                                                    title: 'Alya & Bima',
                                                    slug: 'demo',
                                                    theme: id,
                                                    partner_one_name: 'Alya',
                                                    partner_two_name: 'Bima',
                                                    wedding_at:
                                                        '2027-06-12T02:00:00Z',
                                                    timezone: 'Asia/Jakarta',
                                                    venue_name: 'Yogyakarta',
                                                    venue_address: null,
                                                    story: null,
                                                    media: [],
                                                    content: {},
                                                    rsvp_enabled: true,
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-5">
                                            <span className="font-serif text-xl">
                                                {name}
                                            </span>
                                            <span className="text-xs">
                                                Lihat demo ↗
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section
                        id="cara-kerja"
                        className="bg-[#2f4936] py-24 text-white sm:py-28"
                    >
                        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                            <div className="mx-auto max-w-2xl text-center">
                                <p className="text-sm font-semibold tracking-[0.2em] text-[#b9ceb9] uppercase">
                                    Tiga langkah sederhana
                                </p>
                                <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
                                    Dari cerita menjadi undangan.
                                </h2>
                            </div>
                            <div className="mt-16 grid gap-10 md:grid-cols-3">
                                {[
                                    [
                                        '01',
                                        'Buat akun',
                                        'Daftar dan masuk ke dashboard Wed.by.',
                                    ],
                                    [
                                        '02',
                                        'Isi & pilih tema',
                                        'Lengkapi detail acara dan tentukan tampilan favoritmu.',
                                    ],
                                    [
                                        '03',
                                        'Publish & bagikan',
                                        'Aktifkan undangan dan kirim tautannya kepada para tamu.',
                                    ],
                                ].map(([number, title, description]) => (
                                    <div
                                        key={number}
                                        className="border-t border-white/20 pt-7"
                                    >
                                        <span className="font-serif text-3xl text-[#b9ceb9]">
                                            {number}
                                        </span>
                                        <h3 className="mt-7 text-xl font-semibold">
                                            {title}
                                        </h3>
                                        <p className="mt-3 text-sm leading-7 text-white/65">
                                            {description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="px-5 py-24 sm:px-8 sm:py-28">
                        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-[#ead8cf] px-6 py-16 text-center sm:px-12 sm:py-20">
                            <div className="absolute -top-24 -left-24 size-64 rounded-full bg-white/35 blur-2xl" />
                            <div className="absolute -right-20 -bottom-24 size-64 rounded-full bg-[#c8d8c5]/70 blur-2xl" />
                            <div className="relative mx-auto max-w-2xl">
                                <Heart className="mx-auto size-7 text-[#8c5a4e]" />
                                <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
                                    Siap membagikan hari bahagiamu?
                                </h2>
                                <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#6e5f57] sm:text-base">
                                    Buat undangan digital pertama kalian hari
                                    ini. Sederhana untuk dibuat, indah untuk
                                    dikenang.
                                </p>
                                <Link
                                    href={primaryLink}
                                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#2f4936] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#243b2b]"
                                >
                                    {auth.user
                                        ? 'Buka dashboard'
                                        : 'Mulai buat undangan'}
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-[#ded5c9]">
                    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-[#756c63] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
                        <div className="flex items-center gap-2 font-serif text-xl font-semibold text-[#29241f]">
                            <Heart className="size-4 fill-[#47624d] text-[#47624d]" />{' '}
                            Wed.by
                        </div>
                        <p>Undangan digital untuk cerita yang istimewa.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
