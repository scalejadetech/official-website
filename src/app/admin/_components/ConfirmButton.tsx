'use client';

import { useState, useTransition } from 'react';

/** A destructive button that asks for a second click instead of a browser dialog. */
export function ConfirmButton({
    action,
    label = 'Delete',
    confirmLabel = 'Click again to delete',
}: {
    action: () => Promise<void>;
    label?: string;
    confirmLabel?: string;
}) {
    const [armed, setArmed] = useState(false);
    const [pending, startTransition] = useTransition();

    return (
        <button
            type="button"
            disabled={pending}
            onBlur={() => setArmed(false)}
            onClick={() => {
                if (!armed) return setArmed(true);
                startTransition(() => action());
            }}
            className={
                armed
                    ? 'inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700'
                    : 'inline-flex items-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50'
            }
        >
            {pending ? 'Deleting…' : armed ? confirmLabel : label}
        </button>
    );
}
