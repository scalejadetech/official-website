'use client';

import { useState } from 'react';
import { createUpload } from '../actions';
import { inputClass } from './ui';

const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif,image/gif';

/**
 * A URL input with an upload button. The file goes straight from the browser
 * to Supabase Storage through a signed URL (no size cap from our host), and
 * the resulting public URL fills the input.
 */
export function ImageField({
    name,
    defaultValue,
    folder,
    id,
}: {
    name: string;
    defaultValue?: string | null;
    folder: 'blog' | 'papers' | 'projects' | 'misc';
    id?: string;
}) {
    const [url, setUrl] = useState(defaultValue ?? '');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function upload(file: File) {
        setBusy(true);
        setError(null);
        try {
            const target = await createUpload(folder, file.type);
            if ('error' in target) throw new Error(target.error);
            const res = await fetch(target.uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file,
            });
            if (!res.ok) throw new Error(`Upload failed (${res.status}).`);
            setUrl(target.url);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="grid gap-2">
            <div className="flex gap-2">
                <input
                    id={id}
                    name={name}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-… or upload"
                    className={inputClass}
                />
                <label className="inline-flex shrink-0 cursor-pointer items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    {busy ? 'Uploading…' : 'Upload'}
                    <input
                        type="file"
                        accept={ACCEPT}
                        className="sr-only"
                        disabled={busy}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) upload(file);
                            e.target.value = '';
                        }}
                    />
                </label>
            </div>
            {error && <p className="text-xs text-red-700">{error}</p>}
            {url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="" className="h-28 w-auto max-w-full rounded-lg border border-slate-200 object-cover" />
            )}
        </div>
    );
}
