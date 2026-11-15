import Link from 'next/link';
import { requireAdmin } from '@/lib/admin/session';
import { logout } from '../actions';
import { AdminNav } from './AdminNav';

// Everything inside (panel) requires a signed-in session.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
    await requireAdmin();

    return (
        <div className="min-h-screen">
            <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
                <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
                    <Link href="/admin" className="text-sm font-semibold tracking-tight">
                        ScaleJade <span className="font-normal text-slate-500">Admin</span>
                    </Link>
                    <AdminNav />
                    <div className="ml-auto flex items-center gap-4">
                        <a href="/" target="_blank" rel="noreferrer" className="hidden text-sm text-slate-500 hover:text-slate-900 sm:inline">
                            View site ↗
                        </a>
                        <form action={logout}>
                            <button type="submit" className="text-sm text-slate-500 hover:text-slate-900">
                                Sign out
                            </button>
                        </form>
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
        </div>
    );
}
