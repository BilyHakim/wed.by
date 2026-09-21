import { Head, Link, router, usePage } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import {
    WeddingWebsiteForm,
    type Theme,
    type WeddingWebsiteFormData,
} from '@/components/wedding-website-form';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { show } from '@/routes/wedding';
import { preview, destroy } from '@/routes/wedding-websites';
import { index as guests } from '@/routes/guests';
import { WeddingMediaEditor } from '@/components/wedding-media-editor';

export default function EditWeddingWebsite({
    weddingWebsite,
    themes,
    uploadLimit,
}: {
    weddingWebsite: WeddingWebsiteFormData;
    themes: Theme[];
    uploadLimit: number;
}) {
    const { success } = usePage().props;
    return (
        <>
            <Head title={`Edit ${weddingWebsite.title}`} />
            <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Edit website undangan
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Perubahan pada website yang published akan langsung
                            tampil.
                        </p>
                    </div>
                    {weddingWebsite.status === 'published' && (
                        <Button asChild variant="outline">
                            <Link
                                href={show(weddingWebsite.slug)}
                                target="_blank"
                            >
                                <ExternalLink /> Lihat website
                            </Link>
                        </Button>
                    )}
                </div>
                <WeddingWebsiteForm
                    themes={themes}
                    weddingWebsite={weddingWebsite}
                />
                {typeof success === 'string' && (
                    <p role="status" className="rounded-lg border p-4 text-sm">
                        {success}
                    </p>
                )}
                <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline">
                        <a href="#media">Foto, galeri & lagu</a>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={preview(weddingWebsite.id)} target="_blank">
                            Pratinjau tersimpan
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={guests(weddingWebsite.id)}>
                            Kelola tamu & RSVP
                        </Link>
                    </Button>
                </div>
                <WeddingMediaEditor
                    id={weddingWebsite.id}
                    media={weddingWebsite.media ?? []}
                    uploadLimit={uploadLimit}
                />
                <section className="rounded-xl border border-red-200 p-5">
                    <h2 className="font-medium">Hapus undangan</h2>
                    <p className="text-muted-foreground my-3 text-sm">
                        Undangan beserta data tamu dan RSVP akan dihapus
                        permanen.
                    </p>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            if (
                                window.confirm(
                                    'Hapus undangan ini beserta seluruh data tamu dan RSVP? Tindakan ini tidak dapat dibatalkan.',
                                )
                            )
                                router.delete(destroy.url(weddingWebsite.id));
                        }}
                    >
                        Hapus undangan
                    </Button>
                </section>
            </div>
        </>
    );
}

EditWeddingWebsite.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Edit website', href: dashboard() },
    ],
};
