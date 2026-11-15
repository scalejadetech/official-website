'use client';

import { useActionState } from 'react';
import { login } from '../actions';
import { buttonClass, inputClass } from '../_components/ui';

export function LoginForm() {
    const [state, action, pending] = useActionState(login, undefined);

    return (
        <form action={action} className="grid gap-4">
            <label htmlFor="password" className="sr-only">
                Password
            </label>
            <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                required
                autoFocus
                className={inputClass}
            />
            {state?.error && (
                <p role="alert" className="text-sm text-red-700">
                    {state.error}
                </p>
            )}
            <button type="submit" disabled={pending} className={`${buttonClass.primary} justify-center`}>
                {pending ? 'Signing in…' : 'Sign in'}
            </button>
        </form>
    );
}
