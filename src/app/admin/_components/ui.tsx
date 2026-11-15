import Link from 'next/link';
import type { ReactNode } from 'react';

// Presentational pieces shared by the admin pages. No hooks: usable from
// server and client components alike.

export const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-scalejade-600 focus:outline-none focus:ring-2 focus:ring-scalejade-600/20';

export function Field({
    label,
    hint,
    htmlFor,
    children,
    className = '',
}: {
    label: string;
    hint?: ReactNode;
    htmlFor?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={className}>
            <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-800 mb-1.5">
                {label}
            </label>
            {children}
            {hint && <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{hint}</p>}
        </div>
    );
}

export function Checkbox({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
    return (
        <label className="inline-flex items-center gap-2 text-sm text-slate-800">
            <input
                type="checkbox"
                name={name}
                defaultChecked={defaultChecked}
                className="h-4 w-4 rounded border-slate-300 accent-scalejade-600"
            />
            {label}
        </label>
    );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <fieldset className="rounded-xl border border-slate-200 bg-white p-6">
            <legend className="px-1 text-sm font-semibold text-slate-900">{title}</legend>
            <div className="grid gap-5">{children}</div>
        </fieldset>
    );
}

export function PageHeader({
    title,
    back,
    actions,
}: {
    title: string;
    back?: { href: string; label: string };
    actions?: ReactNode;
}) {
    return (
        <div className="mb-8">
            {back && (
                <Link href={back.href} className="text-sm text-slate-500 hover:text-slate-900">
                    ← {back.label}
                </Link>
            )}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
                {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
            </div>
        </div>
    );
}

export function Status({ published }: { published: boolean }) {
    return published ? (
        <span className="inline-flex rounded-full bg-scalejade-50 px-2 py-0.5 text-xs font-medium text-scalejade-700">
            Published
        </span>
    ) : (
        <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
            Draft
        </span>
    );
}

export const buttonClass = {
    primary:
        'inline-flex items-center rounded-lg bg-scalejade-600 px-4 py-2 text-sm font-medium text-white hover:bg-scalejade-700 disabled:opacity-60',
    secondary:
        'inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60',
    link: 'text-sm font-medium text-scalejade-700 hover:text-scalejade-900',
};
