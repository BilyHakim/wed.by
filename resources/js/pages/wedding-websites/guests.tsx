import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Check,
    Copy,
    Download,
    MessageCircle,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { dashboard } from '@/routes';
import {
    index,
    store,
    update,
    destroy,
    exportMethod,
    qr,
} from '@/routes/guests';
import { edit } from '@/routes/wedding-websites';
import { useState } from 'react';

type Guest = {
    id: number;
    name: string;
    phone: string | null;
    group: string | null;
    pax: number;
    attendance: string;
    attendees: number;
    message: string | null;
    message_approved: boolean;
    checked_in_at: string | null;
    invitation_url: string;
};
type Props = {
    website: {
        id: number;
        title: string;
        slug: string;
        status: string;
        qr_rsvp_enabled: boolean;
    };
    guests: {
        data: Guest[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
        total: number;
    };
    stats: {
        total: number;
        confirmed: number;
        attendees: number;
        pending: number;
        checked_in: number;
    };
    search: string;
};

export default function Guests({ website, guests, stats, search }: Props) {
    const form = useForm({ names: '', phone: '', group: '', pax: 2 });
    const [query, setQuery] = useState(search);
    const [busy, setBusy] = useState<number | null>(null);
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
    const [qrGuest, setQrGuest] = useState<Guest | null>(null);
    const { success } = usePage().props;
    const change = (
        guest: Guest,
        data: { checked_in?: boolean; message_approved?: boolean },
    ) => {
        setBusy(guest.id);
        router.patch(update.url(guest.id), data, {
            preserveScroll: true,
            onFinish: () => setBusy(null),
        });
    };
    const copy = (url: string) => {
        void navigator.clipboard
            .writeText(url)
            .then(() => toast.success('Tautan personal disalin.'))
            .catch(() =>
                toast.error(
                    'Gagal menyalin. Gunakan tombol buka undangan lalu salin alamatnya.',
                ),
            );
    };
    return (
        <div className="space-y-7 p-4 md:p-7">
            <Head title={`Tamu · ${website.title}`} />
            <Dialog
                open={qrGuest !== null}
                onOpenChange={(open) => {
                    if (!open) setQrGuest(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>QR undangan · {qrGuest?.name}</DialogTitle>
                        <DialogDescription>
                            Scan membuka undangan personal dan form RSVP. Jangan
                            bagikan QR tamu ini kepada orang lain.
                        </DialogDescription>
                    </DialogHeader>
                    {qrGuest && (
                        <>
                            <img
                                className="mx-auto aspect-square w-full max-w-80 bg-white"
                                src={qr.url(qrGuest.id)}
                                alt={`QR undangan untuk ${qrGuest.name}`}
                            />
                            <Button asChild>
                                <a
                                    href={qr.url(qrGuest.id, {
                                        query: { download: true },
                                    })}
                                >
                                    <Download size={16} /> Unduh QR (SVG)
                                </a>
                            </Button>
                            <p className="text-muted-foreground text-xs">
                                Gunakan domain yang bisa diakses tamu sebelum
                                mencetak QR. Alamat localhost/127.0.0.1 tidak
                                bisa dibuka dari ponsel lain. Jika slug atau
                                domain berubah, unduh ulang QR.
                            </p>
                        </>
                    )}
                </DialogContent>
            </Dialog>
            <Dialog
                open={editingGuest !== null}
                onOpenChange={(open) => {
                    if (!open) setEditingGuest(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit data tamu</DialogTitle>
                        <DialogDescription>
                            Tautan personal dan konfirmasi yang sudah masuk
                            tetap tersimpan.
                        </DialogDescription>
                    </DialogHeader>
                    {editingGuest && (
                        <GuestEditor
                            key={editingGuest.id}
                            guest={editingGuest}
                            onSaved={() => setEditingGuest(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Link
                        href={edit(website.id)}
                        className="text-muted-foreground text-xs underline"
                    >
                        Kembali ke editor
                    </Link>
                    <h1 className="mt-3 text-2xl font-semibold">
                        {website.title}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Daftar tamu, konfirmasi kehadiran, dan ucapan dalam satu
                        tempat.
                    </p>
                </div>
                <Button asChild variant="outline">
                    <a href={exportMethod.url(website.id)}>
                        <Download size={16} /> Ekspor CSV
                    </a>
                </Button>
            </div>
            {website.status !== 'published' && (
                <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                    Undangan masih draft. Publish dari editor sebelum membagikan
                    tautan kepada tamu.
                </p>
            )}
            {typeof success === 'string' && (
                <p role="status" className="rounded-lg border p-4 text-sm">
                    {success}
                </p>
            )}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                {[
                    ['Undangan', stats.total],
                    ['Konfirmasi hadir', stats.confirmed],
                    ['Jumlah orang', stats.attendees],
                    ['Belum merespons', stats.pending],
                    ['Sudah check-in', stats.checked_in],
                ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border p-4">
                        <p className="text-muted-foreground text-xs">{label}</p>
                        <p className="mt-2 text-3xl font-semibold tabular-nums">
                            {value}
                        </p>
                    </div>
                ))}
            </div>
            <details
                className="bg-card rounded-xl border p-5"
                open={stats.total === 0}
            >
                <summary className="cursor-pointer font-medium">
                    Tambah tamu / tambah banyak sekaligus
                </summary>
                <form
                    className="mt-5 grid gap-4 md:grid-cols-2"
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.post(store.url(website.id), {
                            preserveScroll: true,
                            onSuccess: () => form.reset('names', 'phone'),
                        });
                    }}
                >
                    <label className="grid gap-2 text-sm md:row-span-3">
                        Nama tamu · satu nama per baris
                        <textarea
                            required
                            className="border-input bg-background min-h-40 rounded-md border p-3"
                            value={form.data.names}
                            onChange={(e) =>
                                form.setData('names', e.target.value)
                            }
                            placeholder={
                                'Bapak Hendra & keluarga\nIbu Ratna\nSahabat kampus'
                            }
                        />
                        <span className="text-muted-foreground text-xs">
                            Maksimal 100 nama sekali tambah. Setiap nama
                            mendapat tautan unik.
                        </span>
                    </label>
                    <label className="grid gap-2 text-sm">
                        Grup (opsional)
                        <Input
                            value={form.data.group}
                            onChange={(e) =>
                                form.setData('group', e.target.value)
                            }
                            placeholder="Keluarga / teman / rekan kerja"
                        />
                    </label>
                    <label className="grid gap-2 text-sm">
                        WhatsApp (untuk satu tamu)
                        <Input
                            value={form.data.phone}
                            onChange={(e) =>
                                form.setData('phone', e.target.value)
                            }
                            placeholder="62812…"
                        />
                    </label>
                    <label className="grid gap-2 text-sm">
                        Kuota orang per undangan
                        <Input
                            type="number"
                            min={1}
                            max={20}
                            required
                            value={form.data.pax}
                            onChange={(e) =>
                                form.setData('pax', Number(e.target.value))
                            }
                        />
                    </label>
                    <div className="md:col-span-2">
                        {Object.entries(form.errors).map(([key, message]) => (
                            <p
                                role="alert"
                                key={key}
                                className="mb-2 text-sm text-red-600"
                            >
                                {message}
                            </p>
                        ))}
                        <Button disabled={form.processing}>
                            <Plus size={16} /> Tambah tamu
                        </Button>
                    </div>
                </form>
            </details>
            <form
                className="flex max-w-md gap-2"
                onSubmit={(event) => {
                    event.preventDefault();
                    router.get(
                        index.url(website.id),
                        { search: query },
                        { preserveState: true, preserveScroll: true },
                    );
                }}
            >
                <Input
                    aria-label="Cari nama tamu"
                    placeholder="Cari nama tamu…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button variant="outline" aria-label="Cari">
                    <Search size={16} />
                </Button>
            </form>
            <div className="overflow-x-auto rounded-xl border">
                <table className="w-full min-w-[800px] text-left text-sm">
                    <thead className="bg-muted/60 text-muted-foreground">
                        <tr>
                            {[
                                'Tamu',
                                'RSVP',
                                'Tautan undangan',
                                'Ucapan',
                                'Kehadiran',
                            ].map((heading) => (
                                <th key={heading} className="p-4 font-medium">
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {guests.data.map((guest) => {
                            let phone = (guest.phone ?? '').replace(
                                /[^0-9]/g,
                                '',
                            );
                            if (phone.startsWith('0'))
                                phone = '62' + phone.slice(1);
                            const message = `Yth. ${guest.name}, kami mengundang Anda ke ${website.title}. Detail acara dan RSVP: ${guest.invitation_url}`;
                            return (
                                <tr
                                    key={guest.id}
                                    className="border-t align-top"
                                >
                                    <td className="p-4">
                                        <p className="font-medium">
                                            {guest.name}
                                        </p>
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            {guest.group || 'Tanpa grup'} ·
                                            kuota {guest.pax}
                                        </p>
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            {guest.phone}
                                        </p>
                                        <button
                                            className="mt-3 text-xs underline"
                                            onClick={() =>
                                                setEditingGuest(guest)
                                            }
                                        >
                                            Edit data
                                        </button>
                                        <button
                                            className="mt-3 flex items-center gap-1 text-xs text-red-600"
                                            disabled={busy === guest.id}
                                            onClick={() => {
                                                if (
                                                    window.confirm(
                                                        `Hapus tamu ${guest.name}? Tautannya tidak akan berlaku lagi.`,
                                                    )
                                                ) {
                                                    setBusy(guest.id);
                                                    router.delete(
                                                        destroy.url(guest.id),
                                                        {
                                                            preserveScroll: true,
                                                            onFinish: () =>
                                                                setBusy(null),
                                                        },
                                                    );
                                                }
                                            }}
                                        >
                                            <Trash2 size={12} /> Hapus
                                        </button>
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`inline-block rounded-full px-2 py-1 text-xs ${guest.attendance === 'attending' ? 'bg-emerald-100 text-emerald-900' : guest.attendance === 'declined' ? 'bg-rose-100 text-rose-900' : 'bg-amber-100 text-amber-900'}`}
                                        >
                                            {guest.attendance === 'attending'
                                                ? `Hadir · ${guest.attendees} orang`
                                                : guest.attendance ===
                                                    'declined'
                                                  ? 'Tidak hadir'
                                                  : 'Menunggu'}
                                        </span>
                                    </td>
                                    <td className="space-y-3 p-4">
                                        {website.qr_rsvp_enabled && (
                                            <button
                                                className="block text-xs underline"
                                                onClick={() =>
                                                    setQrGuest(guest)
                                                }
                                            >
                                                Lihat & unduh QR
                                            </button>
                                        )}
                                        <button
                                            disabled={
                                                website.status !== 'published'
                                            }
                                            className="flex items-center gap-2 text-xs disabled:opacity-40"
                                            onClick={() =>
                                                copy(guest.invitation_url)
                                            }
                                        >
                                            <Copy size={14} /> Salin tautan
                                        </button>
                                        {website.status === 'published' && (
                                            <>
                                                <a
                                                    href={
                                                        'https://wa.me/' +
                                                        phone +
                                                        '?text=' +
                                                        encodeURIComponent(
                                                            message,
                                                        )
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-2 text-xs"
                                                >
                                                    <MessageCircle size={14} />{' '}
                                                    Bagikan WhatsApp
                                                </a>
                                                <a
                                                    href={guest.invitation_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="block text-xs underline"
                                                >
                                                    Buka undangan
                                                </a>
                                            </>
                                        )}
                                    </td>
                                    <td className="max-w-64 p-4">
                                        {guest.message ? (
                                            <>
                                                <p className="text-xs leading-6 whitespace-pre-line">
                                                    {guest.message}
                                                </p>
                                                <button
                                                    className="mt-2 text-xs underline"
                                                    disabled={busy === guest.id}
                                                    onClick={() =>
                                                        change(guest, {
                                                            message_approved:
                                                                !guest.message_approved,
                                                        })
                                                    }
                                                >
                                                    {guest.message_approved
                                                        ? 'Sembunyikan ucapan'
                                                        : 'Setujui & tampilkan'}
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-muted-foreground text-xs">
                                                Belum ada ucapan
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <Button
                                            size="sm"
                                            variant={
                                                guest.checked_in_at
                                                    ? 'secondary'
                                                    : 'outline'
                                            }
                                            disabled={busy === guest.id}
                                            onClick={() =>
                                                change(guest, {
                                                    checked_in:
                                                        !guest.checked_in_at,
                                                })
                                            }
                                        >
                                            {guest.checked_in_at ? (
                                                <>
                                                    <Check size={14} /> Batalkan
                                                    check-in
                                                </>
                                            ) : (
                                                'Check-in'
                                            )}
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {guests.data.length === 0 && (
                    <p className="text-muted-foreground p-12 text-center text-sm">
                        {search
                            ? 'Tidak ada tamu yang cocok dengan pencarian.'
                            : 'Daftar tamu masih kosong. Tambahkan nama untuk membuat tautan personal.'}
                    </p>
                )}
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                    Halaman {guests.current_page} dari {guests.last_page} ·{' '}
                    {guests.total} tamu
                </span>
                <div className="flex gap-3">
                    {guests.prev_page_url && (
                        <Link href={guests.prev_page_url} preserveScroll>
                            Sebelumnya
                        </Link>
                    )}
                    {guests.next_page_url && (
                        <Link href={guests.next_page_url} preserveScroll>
                            Selanjutnya
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
Guests.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Tamu & RSVP', href: dashboard() },
    ],
};

function GuestEditor({
    guest,
    onSaved,
}: {
    guest: Guest;
    onSaved: () => void;
}) {
    const form = useForm({
        name: guest.name,
        phone: guest.phone ?? '',
        group: guest.group ?? '',
        pax: guest.pax,
    });
    return (
        <form
            className="space-y-4"
            onSubmit={(event) => {
                event.preventDefault();
                form.patch(update.url(guest.id), {
                    preserveScroll: true,
                    onSuccess: onSaved,
                });
            }}
        >
            <label className="grid gap-2 text-sm">
                Nama
                <Input
                    required
                    maxLength={100}
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                />
            </label>
            <label className="grid gap-2 text-sm">
                WhatsApp
                <Input
                    value={form.data.phone}
                    onChange={(e) => form.setData('phone', e.target.value)}
                />
            </label>
            <label className="grid gap-2 text-sm">
                Grup
                <Input
                    maxLength={80}
                    value={form.data.group}
                    onChange={(e) => form.setData('group', e.target.value)}
                />
            </label>
            <label className="grid gap-2 text-sm">
                Kuota orang
                <Input
                    type="number"
                    required
                    min={Math.max(1, guest.attendees)}
                    max={20}
                    value={form.data.pax}
                    onChange={(e) =>
                        form.setData('pax', Number(e.target.value))
                    }
                />
            </label>
            <p className="text-muted-foreground text-xs">
                Kuota tidak dapat lebih kecil dari jumlah kehadiran yang sudah
                dikonfirmasi.
            </p>
            {Object.entries(form.errors).map(([key, message]) => (
                <p key={key} role="alert" className="text-sm text-red-600">
                    {message}
                </p>
            ))}
            <Button disabled={form.processing}>Simpan data tamu</Button>
        </form>
    );
}
