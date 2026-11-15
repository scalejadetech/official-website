import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin/session';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
    if (await isAdmin()) redirect('/admin');

    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="mb-6 text-lg font-semibold tracking-tight">Sign in</h1>
                <LoginForm />
            </div>
        </main>
    );
}
