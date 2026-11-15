'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
    { href: '/admin', label: 'Overview' },
    { href: '/admin/insights', label: 'Insights' },
    { href: '/admin/work', label: 'Work' },
];

export function AdminNav() {
    const path = usePathname();
    return (
        <nav className="flex items-center gap-1">
            {LINKS.map(({ href, label }) => {
                const active = href === '/admin' ? path === href : path.startsWith(href);
                return (
                    <Link
                        key={href}
                        href={href}
                        aria-current={active ? 'page' : undefined}
                        className={`rounded-md px-3 py-1.5 text-sm ${
                            active ? 'bg-slate-100 font-medium text-slate-900' : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}
