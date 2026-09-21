import { Head, Link } from '@inertiajs/react';
import { CalendarDays, ExternalLink, Heart, Pencil, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WeddingCover } from '@/components/wedding-cover';
import { index as guestIndex } from '@/routes/guests';
import type { Wedding } from '@/types/wedding';
import { eventDate } from '@/types/wedding';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';
import { create, edit } from '@/routes/wedding-websites';
import { show } from '@/routes/wedding';

type WeddingWebsite = Wedding & {
    id: number;
    title: string;
    slug: string;
    theme: string;
    partner_one_name: string;
    partner_two_name: string;
    wedding_at: string | null;
    status: 'draft' | 'published';
    updated_at: string;
};

export default function Dashboard({
    websites,
}: {
    websites: WeddingWebsite[];
}) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Website undangan
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Buat, atur, dan publikasikan undangan pernikahanmu.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create()}>
                            <Plus /> Buat website
                        </Link>
                    </Button>
                </div>

                {websites.length === 0 ? (
                    <Card className="border-dashed py-14 text-center">
                        <CardContent className="flex flex-col items-center gap-4">
                            <div className="bg-muted flex size-12 items-center justify-center rounded-full">
                                <Heart className="size-5" />
                            </div>
                            <div>
                                <h2 className="font-semibold">
                                    Belum ada website undangan
                                </h2>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    Mulai dari data sederhana. Kamu bisa
                                    mengubahnya kapan saja.
                                </p>
                            </div>
                            <Button asChild variant="outline">
                                <Link href={create()}>
                                    Buat undangan pertama
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {websites.map((website) => (
                            <Card
                                key={website.id}
                                className="overflow-hidden pt-0"
                            >
                                <div
                                    className="wedding-surface"
                                    data-theme={website.theme}
                                >
                                    <WeddingCover wedding={website} compact />
                                </div>
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <CardTitle>
                                                {website.title}
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                {website.partner_one_name} &amp;{' '}
                                                {website.partner_two_name}
                                            </CardDescription>
                                        </div>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${website.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}
                                        >
                                            {website.status === 'published'
                                                ? 'Published'
                                                : 'Draft'}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                        <CalendarDays className="size-4" />
                                        {website.wedding_at
                                            ? eventDate(
                                                  website.wedding_at,
                                                  website.timezone,
                                              )
                                            : 'Tanggal belum diatur'}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="outline"
                                        >
                                            <Link href={guestIndex(website.id)}>
                                                Tamu & RSVP
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="sm"
                                            className="flex-1"
                                        >
                                            <Link href={edit(website.id)}>
                                                <Pencil /> Edit
                                            </Link>
                                        </Button>
                                        {website.status === 'published' && (
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Link
                                                    href={show(website.slug)}
                                                    target="_blank"
                                                >
                                                    <ExternalLink />
                                                    <span className="sr-only">
                                                        Lihat website
                                                    </span>
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
