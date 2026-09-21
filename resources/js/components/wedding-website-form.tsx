import { Form } from '@inertiajs/react';
import WeddingWebsiteController from '@/actions/App/Http/Controllers/Dashboard/WeddingWebsiteController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export type Theme = { id: string; name: string; description: string };

export type WeddingWebsiteFormData = {
    id: number;
    title: string;
    slug: string;
    theme: string;
    partner_one_name: string;
    partner_two_name: string;
    wedding_at: string | null;
    venue_name: string | null;
    venue_address: string | null;
    story: string | null;
    status: 'draft' | 'published';
};

function FieldError({ message }: { message?: string }) {
    return <InputError message={message} />;
}

export function WeddingWebsiteForm({
    themes,
    weddingWebsite,
}: {
    themes: Theme[];
    weddingWebsite?: WeddingWebsiteFormData;
}) {
    const form = weddingWebsite
        ? WeddingWebsiteController.update.form(weddingWebsite.id)
        : WeddingWebsiteController.store.form();

    return (
        <Form {...form} disableWhileProcessing className="space-y-6">
            {({ processing, errors }) => (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi utama</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="title">Nama website</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={weddingWebsite?.title}
                                    placeholder="Pernikahan Alya & Bima"
                                    required
                                />
                                <FieldError message={errors.title} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="partner_one_name">
                                    Nama pasangan pertama
                                </Label>
                                <Input
                                    id="partner_one_name"
                                    name="partner_one_name"
                                    defaultValue={
                                        weddingWebsite?.partner_one_name
                                    }
                                    placeholder="Alya"
                                    required
                                />
                                <FieldError message={errors.partner_one_name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="partner_two_name">
                                    Nama pasangan kedua
                                </Label>
                                <Input
                                    id="partner_two_name"
                                    name="partner_two_name"
                                    defaultValue={
                                        weddingWebsite?.partner_two_name
                                    }
                                    placeholder="Bima"
                                    required
                                />
                                <FieldError message={errors.partner_two_name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slug">Alamat website</Label>
                                <div className="flex items-center rounded-md border bg-transparent shadow-xs">
                                    <span className="text-muted-foreground pl-3 text-sm">
                                        /w/
                                    </span>
                                    <Input
                                        id="slug"
                                        name="slug"
                                        defaultValue={weddingWebsite?.slug}
                                        className="border-0 shadow-none focus-visible:ring-0"
                                        placeholder="alya-dan-bima"
                                        pattern="[a-zA-Z0-9_-]+"
                                        required
                                    />
                                </div>
                                <FieldError message={errors.slug} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="wedding_at">
                                    Tanggal & waktu acara
                                </Label>
                                <Input
                                    id="wedding_at"
                                    name="wedding_at"
                                    type="datetime-local"
                                    defaultValue={weddingWebsite?.wedding_at?.slice(
                                        0,
                                        16,
                                    )}
                                />
                                <FieldError message={errors.wedding_at} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pilih tema</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            {themes.map((theme) => (
                                <label
                                    key={theme.id}
                                    className="cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="theme"
                                        value={theme.id}
                                        defaultChecked={
                                            (weddingWebsite?.theme ??
                                                'classic') === theme.id
                                        }
                                        className="peer sr-only"
                                    />
                                    <div className="peer-checked:border-primary peer-checked:ring-primary/20 rounded-xl border p-4 transition peer-checked:ring-2">
                                        <div
                                            className={`mb-4 h-24 rounded-lg ${theme.id === 'garden' ? 'bg-gradient-to-br from-emerald-100 to-lime-50' : 'bg-gradient-to-br from-rose-100 to-amber-50'}`}
                                        />
                                        <p className="font-medium">
                                            {theme.name}
                                        </p>
                                        <p className="text-muted-foreground mt-1 text-sm">
                                            {theme.description}
                                        </p>
                                    </div>
                                </label>
                            ))}
                            <FieldError message={errors.theme} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detail acara</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="venue_name">Nama tempat</Label>
                                <Input
                                    id="venue_name"
                                    name="venue_name"
                                    defaultValue={
                                        weddingWebsite?.venue_name ?? ''
                                    }
                                    placeholder="Gedung Serbaguna"
                                />
                                <FieldError message={errors.venue_name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="venue_address">Alamat</Label>
                                <textarea
                                    id="venue_address"
                                    name="venue_address"
                                    defaultValue={
                                        weddingWebsite?.venue_address ?? ''
                                    }
                                    rows={3}
                                    className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                    placeholder="Alamat lengkap lokasi acara"
                                />
                                <FieldError message={errors.venue_address} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="story">Cerita singkat</Label>
                                <textarea
                                    id="story"
                                    name="story"
                                    defaultValue={weddingWebsite?.story ?? ''}
                                    rows={5}
                                    className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                    placeholder="Ceritakan sedikit perjalanan kalian..."
                                />
                                <FieldError message={errors.story} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    name="status"
                                    defaultValue={
                                        weddingWebsite?.status ?? 'draft'
                                    }
                                    className="border-input bg-background h-9 rounded-md border px-3 text-sm shadow-xs"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                                <FieldError message={errors.status} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner />}
                            {weddingWebsite
                                ? 'Simpan perubahan'
                                : 'Buat website'}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
