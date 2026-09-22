import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    Clock3,
    Gift,
    Heart,
    Images,
    ListChecks,
    MapPinned,
    MessageCircleHeart,
    Music2,
    QrCode,
    ScanLine,
    ShieldCheck,
    Sparkles,
    Users,
} from 'lucide-react';
import { dashboard, login, register } from '@/routes';
import { index as themes, show as themeShow } from '@/routes/themes';
import { WeddingCover } from '@/components/wedding-cover';

const features = [
    {
        icon: QrCode,
        title: 'Pengalaman tamu lebih personal',
        description:
            'Setiap tamu dapat menerima tautan dan QR code personal yang langsung membuka undangan atas nama mereka.',
    },
    {
        icon: Users,
        title: 'Data tamu lebih terorganisir',
        description:
            'RSVP, jumlah kehadiran, check-in, ucapan, dan daftar tamu dikelola dalam satu tempat.',
    },
    {
        icon: ShieldCheck,
        title: 'Lebih aman dan terkendali',
        description:
            'Tautan tamu bersifat personal dan setiap ucapan dapat ditinjau sebelum ditampilkan di undangan.',
    },
];

const invitationFeatures = [
    {
        icon: QrCode,
        title: 'QR code personal',
        description:
            'QR otomatis untuk setiap tamu, siap dilihat atau diunduh untuk dibagikan secara personal.',
    },
    {
        icon: ListChecks,
        title: 'RSVP & kuota tamu',
        description:
            'Tamu dapat mengonfirmasi kehadiran dan jumlah peserta sesuai kuota yang sudah ditentukan.',
    },
    {
        icon: ScanLine,
        title: 'Check-in & laporan tamu',
        description:
            'Pantau tamu hadir, statistik RSVP, jumlah peserta, dan ekspor data ke file CSV.',
    },
    {
        icon: MessageCircleHeart,
        title: 'Ucapan dan doa',
        description:
            'Tamu dapat mengirimkan doa, sementara Anda tetap dapat meninjau ucapan sebelum ditampilkan.',
    },
    {
        icon: Images,
        title: 'Galeri foto',
        description:
            'Tampilkan foto sampul, foto pasangan, dan hingga 12 foto perjalanan kalian dalam satu undangan.',
    },
    {
        icon: Music2,
        title: 'Musik latar',
        description:
            'Tambahkan musik pilihan untuk membangun suasana yang lebih hangat ketika undangan dibuka.',
    },
    {
        icon: MapPinned,
        title: 'Peta & kalender',
        description:
            'Tautkan lokasi acara dan bantu tamu menyimpan jadwal langsung ke Google Calendar.',
    },
    {
        icon: Gift,
        title: 'Amplop digital',
        description:
            'Sediakan informasi rekening hadiah secara rapi dan mudah disalin oleh tamu.',
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
                    content="Pesan layanan undangan digital yang personal dan dikerjakan oleh tim Wed.by."
                />
            </Head>

            <div className="min-h-screen overflow-hidden bg-[#f2eae0] text-[#3f3855]">
                <header className="relative z-20 border-b border-[#bda6ce]/60 bg-[#f2eae0]/90 backdrop-blur-xl">
                    <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
                        <Link href="/" className="flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-full bg-[#9b8ec7] text-white shadow-sm">
                                <Heart className="size-5 fill-current" />
                            </span>
                            <span className="font-serif text-2xl font-semibold tracking-tight">
                                Wed<span className="text-[#7165a5]">.by</span>
                            </span>
                        </Link>

                        <div className="hidden items-center gap-8 text-sm text-[#675f78] md:flex">
                            <a
                                href="#fitur-undangan"
                                className="transition hover:text-[#7165a5]"
                            >
                                Fitur
                            </a>
                            <a
                                href="#tema"
                                className="transition hover:text-[#7165a5]"
                            >
                                Tema
                            </a>
                            <a
                                href="#cara-kerja"
                                className="transition hover:text-[#7165a5]"
                            >
                                Cara kerja
                            </a>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-full bg-[#7165a5] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#5f548f]"
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
                                        className="rounded-full bg-[#7165a5] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#5f548f]"
                                    >
                                        Pesan sekarang
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <main>
                    <section className="relative">
                        <div className="absolute top-0 left-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#bda6ce]/55 blur-3xl" />
                        <div className="absolute right-0 bottom-0 h-[30rem] w-[30rem] translate-x-1/3 rounded-full bg-[#b4d3d9]/70 blur-3xl" />

                        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-28">
                            <div className="max-w-2xl">
                                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#bda6ce] bg-white/60 px-4 py-2 text-xs font-medium tracking-wide text-[#675f78] uppercase shadow-sm">
                                    <Sparkles className="size-3.5" />
                                    Undangan digital yang berkesan
                                </div>
                                <h1 className="font-serif text-5xl leading-[1.08] font-medium tracking-tight sm:text-6xl lg:text-7xl">
                                    Cerita indahmu,
                                    <span className="block text-[#7165a5] italic">
                                        dalam satu undangan.
                                    </span>
                                </h1>
                                <p className="mt-7 max-w-xl text-base leading-8 text-[#675f78] sm:text-lg">
                                    Pesan undangan digital yang cantik dan
                                    personal. Pilih tema, kirimkan cerita
                                    kalian, lalu biarkan tim kami
                                    mengerjakannya.
                                </p>

                                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                    <Link
                                        href={primaryLink}
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7165a5] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#9b8ec7]/30 transition hover:-translate-y-0.5 hover:bg-[#5f548f]"
                                    >
                                        {auth.user
                                            ? 'Buka dashboard'
                                            : 'Lihat paket & pesan'}
                                        <ArrowRight className="size-4" />
                                    </Link>
                                    <a
                                        href="#tema"
                                        className="inline-flex items-center justify-center rounded-full border border-[#bda6ce] bg-white/50 px-7 py-3.5 text-sm font-semibold transition hover:bg-white/80"
                                    >
                                        Lihat pilihan tema
                                    </a>
                                </div>

                                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#675f78]">
                                    <span className="flex items-center gap-2">
                                        <Check className="size-4 text-[#7165a5]" />{' '}
                                        Dikerjakan profesional
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Check className="size-4 text-[#7165a5]" />{' '}
                                        Progres mudah dipantau
                                    </span>
                                </div>
                            </div>

                            <div className="relative mx-auto flex w-full max-w-2xl flex-col gap-4 lg:mx-0">
                                <div className="flex w-fit items-center gap-3 self-end rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
                                    <span className="flex size-9 items-center justify-center rounded-full bg-[#b4d3d9]/50">
                                        <Clock3 className="size-4 text-[#5f548f]" />
                                    </span>
                                    <div>
                                        <p className="font-semibold">
                                            Proses transparan
                                        </p>
                                        <p className="text-xs text-[#675f78]">
                                            Pantau pesanan kapan saja
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-[2rem] border border-white/80 bg-white/45 p-3 shadow-2xl shadow-[#7165a5]/20 backdrop-blur-sm sm:p-5">
                                    <div className="overflow-hidden rounded-[1.5rem] border border-[#bda6ce]/60 bg-[#faf7f3]">
                                        <div className="flex h-10 items-center gap-2 border-b border-[#bda6ce]/50 bg-white/70 px-4">
                                            <span className="size-2.5 rounded-full bg-[#9b8ec7]" />
                                            <span className="size-2.5 rounded-full bg-[#bda6ce]" />
                                            <span className="size-2.5 rounded-full bg-[#b4d3d9]" />
                                            <div className="mx-auto rounded-full bg-[#f2eae0] px-10 py-1 text-[10px] text-[#675f78] sm:px-20">
                                                wed.by/w/alya-dan-bima
                                            </div>
                                        </div>
                                        <div className="relative flex min-h-[31rem] items-center justify-center overflow-hidden px-6 py-16 text-center sm:min-h-[35rem]">
                                            <div className="absolute -top-24 -left-20 size-64 rounded-full bg-rose-100/80 blur-3xl" />
                                            <div className="absolute -right-16 -bottom-20 size-64 rounded-full bg-amber-100/90 blur-3xl" />
                                            <div className="relative">
                                                <Heart
                                                    className="mx-auto mb-8 size-6 text-[#7165a5]"
                                                    strokeWidth={1.5}
                                                />
                                                <p className="text-xs font-semibold tracking-[0.35em] text-[#675f78] uppercase">
                                                    The Wedding Of
                                                </p>
                                                <p className="mt-7 font-serif text-5xl text-[#3f3855] sm:text-6xl">
                                                    Alya
                                                    <span className="block py-2 text-3xl italic">
                                                        &amp;
                                                    </span>
                                                    Bima
                                                </p>
                                                <div className="mx-auto mt-7 h-px w-16 bg-[#9b8ec7]" />
                                                <p className="mt-6 text-xs tracking-[0.2em] text-[#675f78] uppercase">
                                                    15 Januari 2027
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-fit rounded-2xl bg-[#7165a5] px-5 py-4 text-white shadow-sm">
                                    <p className="text-xs text-white/70">
                                        Status pesanan
                                    </p>
                                    <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                                        <span className="size-2 rounded-full bg-[#b4d3d9]" />{' '}
                                        Siap dibagikan
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="fitur" className="bg-[#faf7f3] py-24 sm:py-28">
                        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                            <div className="mx-auto max-w-2xl text-center">
                                <p className="text-sm font-semibold tracking-[0.2em] text-[#7165a5] uppercase">
                                    Kenapa memilih Wed.by
                                </p>
                                <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                                    Bukan sekadar halaman undangan yang cantik.
                                </h2>
                            </div>

                            <div className="mt-16 grid gap-5 md:grid-cols-3">
                                {features.map((feature) => (
                                    <div
                                        key={feature.title}
                                        className="rounded-3xl border border-[#bda6ce]/55 bg-[#f2eae0]/55 p-7 transition hover:-translate-y-1 hover:border-[#9b8ec7] hover:shadow-xl hover:shadow-[#9b8ec7]/15"
                                    >
                                        <span className="flex size-12 items-center justify-center rounded-2xl bg-[#b4d3d9]/70 text-[#4f6370]">
                                            <feature.icon className="size-5" />
                                        </span>
                                        <h3 className="mt-6 text-lg font-semibold">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-3 text-sm leading-7 text-[#675f78]">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section
                        id="fitur-undangan"
                        className="relative overflow-hidden py-24 sm:py-28"
                    >
                        <div className="absolute -top-32 right-0 size-80 rounded-full bg-[#b4d3d9]/45 blur-3xl" />
                        <div className="absolute -bottom-32 left-0 size-80 rounded-full bg-[#bda6ce]/45 blur-3xl" />
                        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                            <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
                                <div>
                                    <p className="text-sm font-semibold tracking-[0.2em] text-[#7165a5] uppercase">
                                        Fitur undangan
                                    </p>
                                    <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight sm:text-5xl">
                                        Semua yang dibutuhkan, dalam satu
                                        layanan.
                                    </h2>
                                </div>
                                <p className="max-w-xl text-sm leading-7 text-[#675f78] lg:justify-self-end">
                                    Dari undangan personal hingga pencatatan
                                    tamu saat hari acara, setiap fitur dirancang
                                    agar kalian dan para tamu mendapat
                                    pengalaman yang lebih praktis.
                                </p>
                            </div>

                            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {invitationFeatures.map((feature, index) => (
                                    <article
                                        key={feature.title}
                                        className="group rounded-3xl border border-[#bda6ce]/60 bg-white/55 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-2 hover:border-[#9b8ec7] hover:bg-white/80 hover:shadow-xl hover:shadow-[#9b8ec7]/15"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="flex size-11 items-center justify-center rounded-2xl bg-[#b4d3d9]/65 text-[#4f6370] transition group-hover:scale-110 group-hover:rotate-6">
                                                <feature.icon className="size-5" />
                                            </span>
                                            <span className="font-serif text-sm text-[#9b8ec7]">
                                                {String(index + 1).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </span>
                                        </div>
                                        <h3 className="mt-6 text-lg font-semibold">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-3 text-sm leading-7 text-[#675f78]">
                                            {feature.description}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="tema" className="bg-[#faf7f3] py-24 sm:py-28">
                        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                                <div className="max-w-2xl">
                                    <p className="text-sm font-semibold tracking-[0.2em] text-[#7165a5] uppercase">
                                        Pilihan tema
                                    </p>
                                    <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
                                        Tampilan cantik untuk setiap cerita.
                                    </h2>
                                </div>
                                <p className="max-w-md text-sm leading-7 text-[#675f78]">
                                    Pilih tema saat melakukan pemesanan. Tim
                                    kami akan menyesuaikannya dengan materi dan
                                    cerita kalian.
                                    <Link
                                        href={themes()}
                                        className="mt-3 block font-semibold underline underline-offset-4"
                                    >
                                        Jelajahi 7 tema & demo interaktif →
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
                                        className="overflow-hidden border border-[#bda6ce]/70 bg-[#faf7f3] transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#9b8ec7]/20"
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
                        className="bg-[#7165a5] py-24 text-white sm:py-28"
                    >
                        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                            <div className="mx-auto max-w-2xl text-center">
                                <p className="text-sm font-semibold tracking-[0.2em] text-[#b4d3d9] uppercase">
                                    Tiga langkah sederhana
                                </p>
                                <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
                                    Pesan. Kami kerjakan. Siap dibagikan.
                                </h2>
                            </div>
                            <div className="mt-16 grid gap-10 md:grid-cols-3">
                                {[
                                    [
                                        '01',
                                        'Pilih paket & tema',
                                        'Tentukan layanan dan tampilan yang paling sesuai dengan kebutuhan kalian.',
                                    ],
                                    [
                                        '02',
                                        'Pesan & kirim materi',
                                        'Selesaikan pemesanan, lalu kirim detail acara, cerita, dan foto kepada kami.',
                                    ],
                                    [
                                        '03',
                                        'Kami buatkan',
                                        'Pantau prosesnya melalui dashboard hingga undangan selesai dan siap dibagikan.',
                                    ],
                                ].map(([number, title, description]) => (
                                    <div
                                        key={number}
                                        className="border-t border-white/20 pt-7"
                                    >
                                        <span className="font-serif text-3xl text-[#b4d3d9]">
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
                        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-[#bda6ce] px-6 py-16 text-center sm:px-12 sm:py-20">
                            <div className="absolute -top-24 -left-24 size-64 rounded-full bg-white/35 blur-2xl" />
                            <div className="absolute -right-20 -bottom-24 size-64 rounded-full bg-[#b4d3d9]/80 blur-2xl" />
                            <div className="relative mx-auto max-w-2xl">
                                <Heart className="mx-auto size-7 text-[#5f548f]" />
                                <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
                                    Siap memesan undangan digitalmu?
                                </h2>
                                <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#514760] sm:text-base">
                                    Pilih paket dan tema favorit kalian. Tim
                                    kami akan mengerjakannya, sementara
                                    progresnya dapat dipantau dari dashboard.
                                </p>
                                <Link
                                    href={primaryLink}
                                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#7165a5] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#5f548f]"
                                >
                                    {auth.user
                                        ? 'Buka dashboard'
                                        : 'Lihat paket & pesan'}
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-[#bda6ce]">
                    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-[#675f78] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
                        <div className="flex items-center gap-2 font-serif text-xl font-semibold text-[#3f3855]">
                            <Heart className="size-4 fill-[#9b8ec7] text-[#9b8ec7]" />{' '}
                            Wed.by
                        </div>
                        <p>Undangan digital untuk cerita yang istimewa.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
