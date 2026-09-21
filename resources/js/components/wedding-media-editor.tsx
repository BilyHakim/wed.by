import { router, useForm } from '@inertiajs/react';
import { Trash2, Upload } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { store, destroy } from '@/routes/media';
import type { WeddingMedia } from '@/types/wedding';

export function WeddingMediaEditor({
    id,
    media,
    uploadLimit,
}: {
    id: number;
    media: WeddingMedia[];
    uploadLimit: number;
}) {
    const fileInput = useRef<HTMLInputElement>(null);
    const form = useForm<{ kind: string; file: File | null }>({
        kind: 'cover',
        file: null,
    });
    const labels: Record<string, string> = {
        cover: 'Foto sampul',
        partner_one: 'Foto pasangan pertama',
        partner_two: 'Foto pasangan kedua',
        gallery: 'Galeri',
        music: 'Musik latar',
    };
    const imageLimit = Math.min(uploadLimit, 10 * 1024 * 1024);
    const musicLimit = Math.min(uploadLimit, 10 * 1024 * 1024);
    const selectedLimit = form.data.kind === 'music' ? musicLimit : imageLimit;
    return (
        <section
            id="media"
            className="bg-card scroll-mt-6 space-y-6 rounded-xl border p-5 sm:p-7"
        >
            <div>
                <h2 className="text-lg font-semibold">Foto, galeri & musik</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                    Foto JPG, PNG, WebP maksimal {imageLimit / 1024 / 1024} MB.
                    Musik MP3/WAV maksimal {musicLimit / 1024 / 1024} MB. Galeri
                    menampung 12 foto. Batas mengikuti konfigurasi server.
                </p>
            </div>
            <form
                className="flex flex-wrap items-end gap-3"
                onSubmit={(event) => {
                    event.preventDefault();
                    form.post(store.url(id), {
                        forceFormData: true,
                        preserveScroll: true,
                        onSuccess: () => {
                            form.reset('file');
                            if (fileInput.current) fileInput.current.value = '';
                        },
                    });
                }}
            >
                <label className="grid gap-2 text-sm">
                    Penempatan
                    <select
                        className="border-input bg-background h-10 rounded-md border px-3"
                        value={form.data.kind}
                        onChange={(e) => {
                            form.setData('kind', e.target.value);
                            form.setData('file', null);
                        }}
                    >
                        {Object.entries(labels).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="grid flex-1 gap-2 text-sm">
                    Pilih file
                    <input
                        key={form.data.kind}
                        ref={fileInput}
                        type="file"
                        required
                        accept={
                            form.data.kind === 'music'
                                ? '.mp3,.wav'
                                : '.jpg,.jpeg,.png,.webp'
                        }
                        onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            form.clearErrors('file');
                            if (file && file.size > selectedLimit) {
                                form.setData('file', null);
                                form.setError(
                                    'file',
                                    `Ukuran file maksimal ${selectedLimit / 1024 / 1024} MB pada server ini.`,
                                );
                            } else form.setData('file', file);
                        }}
                        className="border-input h-10 max-w-full rounded-md border p-2 text-xs"
                    />
                </label>
                <Button disabled={form.processing || !form.data.file}>
                    <Upload size={16} />
                    {form.processing
                        ? `Mengunggah ${form.progress?.percentage ?? 0}%`
                        : 'Unggah'}
                </Button>
            </form>
            {Object.entries(form.errors).map(([key, message]) => (
                <p key={key} className="text-sm text-red-600" role="alert">
                    {message}
                </p>
            ))}
            <div className="grid gap-4 sm:grid-cols-3">
                {media.map((item) => (
                    <article
                        key={item.id}
                        className="overflow-hidden rounded-lg border"
                    >
                        {item.kind === 'music' ? (
                            <audio
                                src={item.url}
                                controls
                                preload="none"
                                className="w-full"
                            />
                        ) : (
                            <img
                                src={item.url}
                                alt={labels[item.kind]}
                                className="aspect-[4/3] w-full object-cover"
                            />
                        )}
                        <div className="flex items-center justify-between gap-2 p-3">
                            <p className="text-xs">{labels[item.kind]}</p>
                            <Button
                                size="sm"
                                variant="ghost"
                                aria-label={`Hapus ${labels[item.kind]}`}
                                onClick={() => {
                                    if (
                                        window.confirm(
                                            'Hapus media ini dari undangan?',
                                        )
                                    )
                                        router.delete(
                                            destroy.url({
                                                weddingWebsite: id,
                                                media: item.id,
                                            }),
                                            { preserveScroll: true },
                                        );
                                }}
                            >
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </article>
                ))}
            </div>
            {media.length === 0 && (
                <p className="text-muted-foreground border border-dashed p-8 text-center text-sm">
                    Tambahkan foto kalian. Tema tetap dapat digunakan tanpa
                    foto.
                </p>
            )}
        </section>
    );
}
