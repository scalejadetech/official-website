'use client';

import { useActionState, useTransition, type ReactNode } from 'react';
import type { FormState } from '../actions';
import { buttonClass } from './ui';

/**
 * A form bound to a server action that returns FormState. Shows the error or
 * success message above the submit button.
 */
export function ActionForm({
    action,
    submitLabel,
    children,
    initialMessage,
    className = 'grid gap-6',
}: {
    action: (prev: FormState, fd: FormData) => Promise<FormState>;
    submitLabel: string;
    children: ReactNode;
    initialMessage?: string;
    className?: string;
}) {
    const [state, formAction, pending] = useActionState(action, initialMessage ? { ok: initialMessage } : undefined);
    const [, startTransition] = useTransition();

    return (
        <form
            className={className}
            // Not `action={formAction}`: React resets a form after its action
            // runs, which would wipe the fields when a save fails validation.
            onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                startTransition(() => formAction(fd));
            }}
        >
            {children}
            <div className="flex flex-wrap items-center gap-4">
                <button type="submit" disabled={pending} className={buttonClass.primary}>
                    {pending ? 'Saving…' : submitLabel}
                </button>
                {!pending && state?.error && (
                    <p role="alert" className="text-sm text-red-700">
                        {state.error}
                    </p>
                )}
                {!pending && state?.ok && (
                    <p role="status" className="text-sm text-scalejade-700">
                        {state.ok}
                    </p>
                )}
            </div>
        </form>
    );
}
