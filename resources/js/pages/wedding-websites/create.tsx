import { Head } from '@inertiajs/react';
import {
    WeddingWebsiteForm,
    type Theme,
} from '@/components/wedding-website-form';
import { dashboard } from '@/routes';
import { create } from '@/routes/wedding-websites';

export default function CreateWeddingWebsite({
    themes,
    selectedTheme,
}: {
    themes: Theme[];
    selectedTheme: string;
}) {
    return (
        <>
            <Head title="Buat website undangan" />
            <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Buat website undangan
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Isi informasi dasar, pilih tema, lalu simpan sebagai
                        draft atau langsung publish. Foto galeri dan lagu dapat
                        diunggah setelah undangan pertama kali disimpan.
                    </p>
                </div>
                <WeddingWebsiteForm
                    themes={themes}
                    selectedTheme={selectedTheme}
                />
            </div>
        </>
    );
}

CreateWeddingWebsite.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Buat website', href: create() },
    ],
};
