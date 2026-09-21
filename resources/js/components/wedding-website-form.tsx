import { Link, useForm } from '@inertiajs/react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import {
    store,
    update,
} from '@/actions/App/Http/Controllers/Dashboard/WeddingWebsiteController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WeddingCover } from '@/components/wedding-cover';
import { show as themePreview } from '@/routes/themes';
import type { Wedding, WeddingTheme, WeddingContent } from '@/types/wedding';
import { localDateInput } from '@/types/wedding';

export type Theme = WeddingTheme;
export type WeddingWebsiteFormData = Wedding & {
    id: number;
    status: 'draft' | 'published';
};

export function EditorField({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <label className="grid gap-2 text-sm font-medium">
            {title}
            {children}
        </label>
    );
}
const textareaClass =
    'border-input bg-background min-h-24 w-full rounded-md border px-3 py-2 text-sm font-normal';
const tabs = [
    'Dasar & pasangan',
    'Acara',
    'Cerita & pesan',
    'Amplop digital',
    'Tema & publikasi',
];

export function WeddingWebsiteForm({
    themes,
    weddingWebsite,
    selectedTheme = 'classic',
}: {
    themes: Theme[];
    weddingWebsite?: WeddingWebsiteFormData;
    selectedTheme?: string;
}) {
    const [tab, setTab] = useState(0);
    const timezone = weddingWebsite?.timezone ?? 'Asia/Jakarta';
    const source = weddingWebsite?.content ?? {};
    const content: WeddingContent = {
        opening: source.opening ?? '',
        closing: source.closing ?? '',
        partner_one_full: source.partner_one_full ?? '',
        partner_two_full: source.partner_two_full ?? '',
        partner_one_parents: source.partner_one_parents ?? '',
        partner_two_parents: source.partner_two_parents ?? '',
        quote: source.quote ?? '',
        quote_source: source.quote_source ?? '',
        maps_url: source.maps_url ?? '',
        events: (source.events ?? []).map((event) => ({
            ...event,
            at: localDateInput(event.at, timezone),
        })),
        gifts: source.gifts ?? [],
    };
    const form = useForm({
        title: weddingWebsite?.title ?? '',
        slug: weddingWebsite?.slug ?? '',
        theme: weddingWebsite?.theme ?? selectedTheme,
        partner_one_name: weddingWebsite?.partner_one_name ?? '',
        partner_two_name: weddingWebsite?.partner_two_name ?? '',
        wedding_at: localDateInput(weddingWebsite?.wedding_at, timezone),
        timezone,
        venue_name: weddingWebsite?.venue_name ?? '',
        venue_address: weddingWebsite?.venue_address ?? '',
        story: weddingWebsite?.story ?? '',
        status: weddingWebsite?.status ?? 'draft',
        rsvp_enabled: weddingWebsite?.rsvp_enabled ?? true,
        qr_rsvp_enabled: weddingWebsite?.qr_rsvp_enabled ?? false,
        content,
    });
    const setContent = <K extends keyof WeddingContent>(
        key: K,
        value: WeddingContent[K],
    ) => form.setData('content', { ...form.data.content, [key]: value });
    const sample: Wedding = {
        ...form.data,
        wedding_at: weddingWebsite?.wedding_at ?? null,
        media: weddingWebsite?.media ?? [],
    };
    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                if (weddingWebsite)
                    form.put(update.url(weddingWebsite.id), {
                        preserveScroll: true,
                    });
                else form.post(store.url());
            }}
            className="space-y-6"
        >
            <div
                className="flex flex-wrap gap-2 border-b pb-4"
                role="tablist"
                aria-label="Bagian editor"
            >
                {tabs.map((title, index) => (
                    <button
                        key={title}
                        id={`editor-tab-${index}`}
                        aria-controls={`editor-panel-${index}`}
                        type="button"
                        role="tab"
                        aria-selected={tab === index}
                        onClick={() => setTab(index)}
                        className={`rounded-md px-3 py-2 text-sm transition ${tab === index ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                    >
                        {index + 1}. {title}
                    </button>
                ))}
            </div>
            {Object.keys(form.errors).length > 0 && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800"
                >
                    <p className="font-semibold">
                        Periksa kembali isian berikut:
                    </p>
                    <ul className="mt-2 list-inside list-disc">
                        {Object.entries(form.errors).map(([key, message]) => (
                            <li key={key}>{message}</li>
                        ))}
                    </ul>
                </div>
            )}
            <section
                role="tabpanel"
                id={`editor-panel-${tab}`}
                aria-labelledby={`editor-tab-${tab}`}
                className="bg-card rounded-xl border p-5 sm:p-7"
            >
                {tab === 0 && (
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <h2 className="text-lg font-semibold">
                                Mulai dari kalian berdua.
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Nama panggilan tampil di sampul; nama lengkap
                                dan keluarga di bagian pasangan.
                            </p>
                        </div>
                        <EditorField title="Judul undangan">
                            <Input
                                value={form.data.title}
                                onChange={(e) =>
                                    form.setData('title', e.target.value)
                                }
                                placeholder="Pernikahan Alya & Bima"
                                maxLength={100}
                            />
                        </EditorField>
                        <EditorField title="Alamat undangan /w/">
                            <Input
                                value={form.data.slug}
                                onChange={(e) =>
                                    form.setData(
                                        'slug',
                                        e.target.value.toLowerCase(),
                                    )
                                }
                                placeholder="alya-dan-bima"
                                maxLength={100}
                            />
                        </EditorField>
                        <EditorField title="Nama panggilan pasangan pertama">
                            <Input
                                value={form.data.partner_one_name}
                                onChange={(e) =>
                                    form.setData(
                                        'partner_one_name',
                                        e.target.value,
                                    )
                                }
                                maxLength={100}
                            />
                        </EditorField>
                        <EditorField title="Nama panggilan pasangan kedua">
                            <Input
                                value={form.data.partner_two_name}
                                onChange={(e) =>
                                    form.setData(
                                        'partner_two_name',
                                        e.target.value,
                                    )
                                }
                                maxLength={100}
                            />
                        </EditorField>
                        <EditorField title="Nama lengkap pasangan pertama">
                            <Input
                                value={form.data.content.partner_one_full}
                                onChange={(e) =>
                                    setContent(
                                        'partner_one_full',
                                        e.target.value,
                                    )
                                }
                            />
                        </EditorField>
                        <EditorField title="Nama lengkap pasangan kedua">
                            <Input
                                value={form.data.content.partner_two_full}
                                onChange={(e) =>
                                    setContent(
                                        'partner_two_full',
                                        e.target.value,
                                    )
                                }
                            />
                        </EditorField>
                        <EditorField title="Keluarga pasangan pertama">
                            <textarea
                                className={textareaClass}
                                value={form.data.content.partner_one_parents}
                                onChange={(e) =>
                                    setContent(
                                        'partner_one_parents',
                                        e.target.value,
                                    )
                                }
                                placeholder="Putri dari Bapak … & Ibu …"
                            />
                        </EditorField>
                        <EditorField title="Keluarga pasangan kedua">
                            <textarea
                                className={textareaClass}
                                value={form.data.content.partner_two_parents}
                                onChange={(e) =>
                                    setContent(
                                        'partner_two_parents',
                                        e.target.value,
                                    )
                                }
                                placeholder="Putra dari Bapak … & Ibu …"
                            />
                        </EditorField>
                    </div>
                )}
                {tab === 1 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Waktu & tempat.
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Acara utama menjadi acuan hitung mundur.
                                Tambahkan akad, resepsi, atau acara lainnya di
                                bawah.
                            </p>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <EditorField title="Tanggal & jam acara utama">
                                <Input
                                    type="datetime-local"
                                    value={form.data.wedding_at}
                                    onChange={(e) =>
                                        form.setData(
                                            'wedding_at',
                                            e.target.value,
                                        )
                                    }
                                />
                            </EditorField>
                            <EditorField title="Zona waktu seluruh acara">
                                <select
                                    className="border-input bg-background h-9 rounded-md border px-3"
                                    value={form.data.timezone}
                                    onChange={(e) =>
                                        form.setData('timezone', e.target.value)
                                    }
                                >
                                    <option value="Asia/Jakarta">
                                        WIB · Jakarta
                                    </option>
                                    <option value="Asia/Makassar">
                                        WITA · Makassar / Bali
                                    </option>
                                    <option value="Asia/Jayapura">
                                        WIT · Jayapura
                                    </option>
                                </select>
                            </EditorField>
                            <EditorField title="Nama tempat">
                                <Input
                                    value={form.data.venue_name}
                                    onChange={(e) =>
                                        form.setData(
                                            'venue_name',
                                            e.target.value,
                                        )
                                    }
                                />
                            </EditorField>
                            <EditorField title="Tautan Google Maps">
                                <Input
                                    type="url"
                                    value={form.data.content.maps_url}
                                    onChange={(e) =>
                                        setContent('maps_url', e.target.value)
                                    }
                                    placeholder="https://maps.app.goo.gl/…"
                                />
                            </EditorField>
                            <div className="sm:col-span-2">
                                <EditorField title="Alamat lengkap">
                                    <textarea
                                        className={textareaClass}
                                        value={form.data.venue_address}
                                        onChange={(e) =>
                                            form.setData(
                                                'venue_address',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </EditorField>
                            </div>
                        </div>
                        {form.data.content.events.map((event, index) => (
                            <div
                                key={index}
                                className="grid gap-4 border-t pt-6 sm:grid-cols-2"
                            >
                                <div className="flex items-center justify-between sm:col-span-2">
                                    <h3 className="font-medium">
                                        Acara tambahan {index + 1}
                                    </h3>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                            setContent(
                                                'events',
                                                form.data.content.events.filter(
                                                    (_, i) => i !== index,
                                                ),
                                            )
                                        }
                                    >
                                        <Trash2 size={14} /> Hapus
                                    </Button>
                                </div>
                                {(
                                    [
                                        'name',
                                        'at',
                                        'venue',
                                        'address',
                                        'maps_url',
                                    ] as const
                                ).map((key) => (
                                    <EditorField
                                        key={key}
                                        title={
                                            {
                                                name: 'Nama acara',
                                                at: 'Tanggal & jam',
                                                venue: 'Tempat',
                                                address: 'Alamat',
                                                maps_url: 'Tautan peta',
                                            }[key]
                                        }
                                    >
                                        <Input
                                            type={
                                                key === 'at'
                                                    ? 'datetime-local'
                                                    : key === 'maps_url'
                                                      ? 'url'
                                                      : 'text'
                                            }
                                            value={event[key] ?? ''}
                                            onChange={(e) =>
                                                setContent(
                                                    'events',
                                                    form.data.content.events.map(
                                                        (item, i) =>
                                                            i === index
                                                                ? {
                                                                      ...item,
                                                                      [key]: e
                                                                          .target
                                                                          .value,
                                                                  }
                                                                : item,
                                                    ),
                                                )
                                            }
                                        />
                                    </EditorField>
                                ))}
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            disabled={form.data.content.events.length >= 5}
                            onClick={() =>
                                setContent('events', [
                                    ...form.data.content.events,
                                    {
                                        name: 'Resepsi',
                                        at: '',
                                        venue: '',
                                        address: '',
                                        maps_url: '',
                                    },
                                ])
                            }
                        >
                            <Plus /> Tambah acara
                        </Button>
                    </div>
                )}
                {tab === 2 && (
                    <div className="space-y-5">
                        <h2 className="text-lg font-semibold">
                            Tuliskan dengan suara kalian.
                        </h2>
                        <EditorField title="Salam pembuka">
                            <textarea
                                className={textareaClass}
                                value={form.data.content.opening}
                                onChange={(e) =>
                                    setContent('opening', e.target.value)
                                }
                                placeholder="Dengan penuh rasa syukur, kami mengundang…"
                            />
                        </EditorField>
                        <EditorField title="Cerita kalian">
                            <textarea
                                className={textareaClass + ' min-h-48'}
                                value={form.data.story}
                                onChange={(e) =>
                                    form.setData('story', e.target.value)
                                }
                                placeholder="Ceritakan momen yang mempertemukan kalian."
                                maxLength={5000}
                            />
                        </EditorField>
                        <EditorField title="Kutipan atau doa (opsional)">
                            <textarea
                                className={textareaClass}
                                value={form.data.content.quote}
                                onChange={(e) =>
                                    setContent('quote', e.target.value)
                                }
                            />
                        </EditorField>
                        <EditorField title="Sumber kutipan">
                            <Input
                                value={form.data.content.quote_source}
                                onChange={(e) =>
                                    setContent('quote_source', e.target.value)
                                }
                            />
                        </EditorField>
                        <EditorField title="Pesan penutup">
                            <textarea
                                className={textareaClass}
                                value={form.data.content.closing}
                                onChange={(e) =>
                                    setContent('closing', e.target.value)
                                }
                            />
                        </EditorField>
                    </div>
                )}
                {tab === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold">
                            Amplop digital.
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Rekening ditampilkan pada undangan publik. Kosongkan
                            bagian ini jika tidak ingin menerima amplop digital.
                            Transfer dilakukan langsung oleh tamu melalui bank
                            mereka.
                        </p>
                        {form.data.content.gifts.map((gift, index) => (
                            <div
                                key={index}
                                className="grid gap-4 rounded-lg border p-4 sm:grid-cols-3"
                            >
                                {(['bank', 'number', 'holder'] as const).map(
                                    (key) => (
                                        <EditorField
                                            key={key}
                                            title={
                                                {
                                                    bank: 'Bank / e-wallet',
                                                    number: 'Nomor rekening',
                                                    holder: 'Atas nama',
                                                }[key]
                                            }
                                        >
                                            <Input
                                                value={gift[key]}
                                                onChange={(e) =>
                                                    setContent(
                                                        'gifts',
                                                        form.data.content.gifts.map(
                                                            (item, i) =>
                                                                i === index
                                                                    ? {
                                                                          ...item,
                                                                          [key]: e
                                                                              .target
                                                                              .value,
                                                                      }
                                                                    : item,
                                                        ),
                                                    )
                                                }
                                            />
                                        </EditorField>
                                    ),
                                )}
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                        setContent(
                                            'gifts',
                                            form.data.content.gifts.filter(
                                                (_, i) => i !== index,
                                            ),
                                        )
                                    }
                                >
                                    <Trash2 /> Hapus rekening
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            disabled={form.data.content.gifts.length >= 4}
                            onClick={() =>
                                setContent('gifts', [
                                    ...form.data.content.gifts,
                                    { bank: '', number: '', holder: '' },
                                ])
                            }
                        >
                            <Plus /> Tambah rekening
                        </Button>
                    </div>
                )}
                {tab === 4 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Tema & publikasi.
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Pilih desain, simpan, lalu buka pratinjau. Tema
                                dapat diganti tanpa menghapus konten.
                            </p>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            {themes.map((theme) => (
                                <div key={theme.id}>
                                    <label className="block cursor-pointer">
                                        <input
                                            type="radio"
                                            name="theme"
                                            value={theme.id}
                                            checked={
                                                form.data.theme === theme.id
                                            }
                                            onChange={() =>
                                                form.setData('theme', theme.id)
                                            }
                                            className="peer sr-only"
                                        />
                                        <div className="peer-checked:ring-primary peer-focus-visible:ring-primary overflow-hidden rounded-lg border peer-checked:ring-2 peer-focus-visible:ring-4">
                                            <div
                                                className="wedding-surface"
                                                data-theme={theme.id}
                                            >
                                                <WeddingCover
                                                    wedding={{
                                                        ...sample,
                                                        theme: theme.id,
                                                    }}
                                                    compact
                                                />
                                            </div>
                                            <div className="p-4">
                                                <p className="font-medium">
                                                    {theme.name}
                                                </p>
                                                <p className="text-muted-foreground mt-1 text-xs leading-5">
                                                    {theme.description}
                                                </p>
                                            </div>
                                        </div>
                                    </label>
                                    <Link
                                        href={themePreview(theme.id)}
                                        target="_blank"
                                        className="mt-2 inline-block text-xs underline underline-offset-4"
                                    >
                                        Lihat contoh lengkap
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <EditorField title="Status undangan">
                            <select
                                className="border-input bg-background h-10 rounded-md border px-3"
                                value={form.data.status}
                                onChange={(e) =>
                                    form.setData(
                                        'status',
                                        e.target.value as 'draft' | 'published',
                                    )
                                }
                            >
                                <option value="draft">
                                    Draft — hanya dapat dipratinjau oleh Anda
                                </option>
                                <option value="published">
                                    Published — tautan undangan dapat dibuka
                                    tamu
                                </option>
                            </select>
                        </EditorField>
                        <label className="flex items-center gap-3 text-sm">
                            <input
                                type="checkbox"
                                checked={form.data.rsvp_enabled}
                                onChange={(e) =>
                                    form.setData(
                                        'rsvp_enabled',
                                        e.target.checked,
                                    )
                                }
                            />{' '}
                            Terima RSVP dari tamu
                        </label>
                        <EditorField title="Buat QR code personal untuk tamu?">
                            <select
                                className="border-input bg-background h-11 rounded-md border px-3"
                                value={form.data.qr_rsvp_enabled ? 'yes' : 'no'}
                                onChange={(e) =>
                                    form.setData(
                                        'qr_rsvp_enabled',
                                        e.target.value === 'yes',
                                    )
                                }
                            >
                                <option value="no">
                                    Tidak — gunakan tautan seperti biasa
                                </option>
                                <option value="yes">
                                    Ya — buat QR otomatis per tamu
                                </option>
                            </select>
                        </EditorField>
                        <p className="text-muted-foreground text-xs">
                            Setelah menambahkan tamu, QR tersedia di menu Tamu &
                            RSVP untuk dilihat dan diunduh. Scan membuka
                            undangan personal; tamu tetap mengisi konfirmasinya
                            sendiri, bukan otomatis tercatat hadir.
                        </p>
                        <p className="text-muted-foreground text-xs">
                            Setelah acara selesai, matikan RSVP untuk menutup
                            konfirmasi. Ubah ke Draft untuk menarik undangan
                            dari publik.
                        </p>
                    </div>
                )}
            </section>
            <div className="bg-background/95 sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t py-4 backdrop-blur">
                <span className="text-muted-foreground text-xs" role="status">
                    {form.recentlySuccessful
                        ? 'Semua perubahan tersimpan.'
                        : form.isDirty
                          ? 'Ada perubahan yang belum disimpan.'
                          : 'Foto & musik dapat dikelola setelah undangan dibuat.'}
                </span>
                <div className="flex gap-2">
                    {tab < tabs.length - 1 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setTab(tab + 1)}
                        >
                            Lanjut
                        </Button>
                    )}
                    <Button type="submit" disabled={form.processing}>
                        <Save size={16} />
                        {form.processing
                            ? 'Menyimpan…'
                            : weddingWebsite
                              ? 'Simpan perubahan'
                              : 'Buat undangan'}
                    </Button>
                </div>
            </div>
        </form>
    );
}
