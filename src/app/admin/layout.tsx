import { DM_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import '@/app/globals.css';

// Root layout for the hidden admin dashboard. Separate from the public site's
// [locale] layout: no navigation, no footer, no analytics, never indexed.

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });

export const metadata: Metadata = {
    title: 'Admin',
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={dmSans.variable}>
            <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">{children}</body>
        </html>
    );
}
