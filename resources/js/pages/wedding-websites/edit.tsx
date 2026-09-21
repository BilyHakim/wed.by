import { Head, Link } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import {
    WeddingWebsiteForm,
    type Theme,
    type WeddingWebsiteFormData,
} from '@/components/wedding-website-form';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { show } from '@/routes/wedding';

export default function EditWeddingWebsite({
    weddingWebsite,
    themes,
}: {
    weddingWebsite: WeddingWebsiteFormData;
    themes: Theme[];
}) {
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
