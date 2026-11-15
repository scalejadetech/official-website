'use client';

import { useState } from 'react';
import { addProjectImages, createUpload } from '../../../actions';
import { buttonClass, inputClass } from '../../../_components/ui';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
const PARALLEL = 3;

type Item = { name: string; status: 'waiting' | 'uploading' | 'done' | 'failed'; url?: string; error?: string };

/**
 * Pick or drop several images at once. Each file goes straight from the
 * browser to Supabase Storage through a signed URL, then the uploaded ones
 * are added to the gallery in one batch, in the order they were selected.
 */
export function MultiImageUpload({ slug, kinds }: { slug: string; kinds: readonly string[] }) {
    const [items, setItems] = useState<Item[]>([]);
    const [kind, setKind] = useState('other');
    const [isConfidential, setIsConfidential] = useState(false);
    const [busy, setBusy] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [message, setMessage] = useState<{ error?: string; ok?: string } | null>(null);

    const update = (i: number, patch: Partial<Item>) =>
        setItems((prev) => prev.map((it, j) => (j === i ? { ...it, ...patch } : it)));

    async function uploadOne(file: File, i: number): Promise<string | null> {
        if (!ACCEPTED.includes(file.type)) {
            update(i, { status: 'failed', error: 'Not a JPEG, PNG, WebP, AVIF or GIF' });
            return null;
        }
        update(i, { status: 'uploading' });
        try {
            const target = await createUpload('projects', file.type);
            if ('error' in target) throw new Error(target.error);
            const res = await fetch(target.uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
            if (!res.ok) throw new Error(`Upload failed (${res.status})`);
            update(i, { status: 'done', url: target.url });
            return target.url;
        } catch (e) {
            update(i, { status: 'failed', error: (e as Error).message });
            return null;
        }
    }

    async function handle(files: File[]) {
        if (files.length === 0 || busy) return;
        setBusy(true);
        setMessage(null);
        setItems(files.map((f) => ({ name: f.name, status: 'waiting' })));

        // A few at a time; results keep the selection order.
        const urls: (string | null)[] = new Array(files.length).fill(null);
        let next = 0;
        await Promise.all(
            Array.from({ length: Math.min(PARALLEL, files.length) }, async () => {
                while (next < files.length) {
                    const i = next++;
                    urls[i] = await uploadOne(files[i], i);
                }
            })
        );

        const uploaded = urls.filter((u): u is string => u !== null);
        if (uploaded.length) {
            const result = await addProjectImages(slug, uploaded, { kind, isConfidential });
            setMessage(result ?? null);
            if (result?.ok && uploaded.length === files.length) setItems([]);
        } else {
            setMessage({ error: 'None of the images uploaded.' });
        }
        setBusy(false);
    }

    return (
        <div className="grid gap-4">
            <div className="flex flex-wrap items-end gap-4">
                <label className="grid gap-1.5 text-sm font-medium text-slate-800">
                    Kind
                    <select value={kind} onChange={(e) => setKind(e.target.value)} disabled={busy} className={`${inputClass} w-44`}>
                        {kinds.map((k) => <option key={k} value={k}>{k[0].toUpperCase() + k.slice(1)}</option>)}
                    </select>
                </label>
                <label className="inline-flex items-center gap-2 pb-2 text-sm text-slate-800">
                    <input
                        type="checkbox"
                        checked={isConfidential}
                        onChange={(e) => setIsConfidential(e.target.checked)}
                        disabled={busy}
                        className="h-4 w-4 accent-scalejade-600"
                    />
                    Confidential
                </label>
            </div>

            <label
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    handle(Array.from(e.dataTransfer.files));
                }}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center text-sm transition-colors ${
                    dragging ? 'border-scalejade-600 bg-scalejade-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                } ${busy ? 'pointer-events-none opacity-60' : ''}`}
            >
                <span className="font-medium text-slate-800">{busy ? 'Uploading…' : 'Drop images here, or click to choose'}</span>
                <span className="text-slate-500">Select as many as you like. JPEG, PNG, WebP, AVIF or GIF.</span>
                <input
                    type="file"
                    multiple
                    accept={ACCEPTED.join(',')}
                    className="sr-only"
                    disabled={busy}
                    onChange={(e) => {
                        handle(Array.from(e.target.files ?? []));
                        e.target.value = '';
                    }}
                />
            </label>

            {items.length > 0 && (
                <ul className="grid gap-1 text-sm">
                    {items.map((it, i) => (
                        <li key={i} className="flex items-center justify-between gap-4 rounded-lg bg-white px-3 py-1.5">
                            <span className="truncate text-slate-700">{it.name}</span>
                            <span
                                className={
                                    it.status === 'failed'
                                        ? 'shrink-0 text-red-700'
                                        : it.status === 'done'
                                          ? 'shrink-0 text-scalejade-700'
                                          : 'shrink-0 text-slate-500'
                                }
                            >
                                {it.status === 'failed' ? it.error : it.status === 'done' ? 'Uploaded' : it.status === 'uploading' ? 'Uploading…' : 'Waiting'}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            {message?.error && <p role="alert" className="text-sm text-red-700">{message.error}</p>}
            {message?.ok && <p role="status" className="text-sm text-scalejade-700">{message.ok}</p>}
            {items.some((it) => it.status === 'failed') && !busy && (
                <button type="button" onClick={() => setItems([])} className={`${buttonClass.secondary} justify-self-start`}>
                    Clear list
                </button>
            )}
        </div>
    );
}
