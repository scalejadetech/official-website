import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import '@/app/globals.css';
import { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const locales = ['en', 'id'];

export const metadata: Metadata = {
  metadataBase: new URL('https://scalejade.com'),
  title: {
    default: 'ScaleJade | Software Engineering · AI · Blockchain & Cloud Infrastructure',
    template: '%s | ScaleJade',
  },
  description: 'ScaleJade is a technology firm helping enterprises build reliable software, AI systems, blockchain networks, and cloud infrastructure — built to perform, built to last.',
  keywords: [
    'software engineering',
    'AI & data science',
    'blockchain & distributed ledger',
    'cloud infrastructure',
    'enterprise technology',
    'custom software development',
    'AI systems',
    'blockchain networks',
    'cloud architecture',
    'ScaleJade'
  ],
  authors: [{ name: 'ScaleJade', url: 'https://scalejade.com' }],
  creator: 'ScaleJade',
  publisher: 'ScaleJade',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://scalejade.com',
    siteName: 'ScaleJade',
    title: 'ScaleJade | Enterprise Software & Technology Solutions',
    description: 'Building reliable technology for enterprises — software engineering, AI, blockchain, and cloud infrastructure designed to scale.',
    images: [
      {
        url: 'https://scalejade.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ScaleJade - Enterprise Technology Partner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ScaleJade',
    creator: '@ScaleJade',
    title: 'ScaleJade | Enterprise Software & Technology',
    description: 'Software engineering, AI, blockchain & cloud infrastructure for regulated industries and enterprises.',
    images: ['https://scalejade.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://scalejade.com',
    languages: {
      'en-US': 'https://scalejade.com/en',
      'id-ID': 'https://scalejade.com/id',
    },
  },
  category: 'Technology',
  classification: 'Enterprise Technology Services',
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Typed as a Promise for Next.js 15
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} antialiased scroll-smooth`}>
      <body className="flex flex-col min-h-screen bg-canvas text-slate-900 font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          
          <Navigation locale={locale} />
          
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          
          <Footer />
          
        </NextIntlClientProvider>
      </body>
    </html>
  );
}