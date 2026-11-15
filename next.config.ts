import createNextIntlPlugin from 'next-intl/plugin';

// Point the plugin to our new config file
const withNextIntl = createNextIntlPlugin('./src/I18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https' as const, hostname: 'images.unsplash.com' },
            // Supabase Storage — project galleries and uploaded media (/api/media).
            { protocol: 'https' as const, hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
        ],
    },
    async headers() {
        return [
            // The admin dashboard is unlinked and must never be indexed. It is
            // deliberately left out of robots.txt, which would advertise it.
            {
                source: '/admin/:path*',
                headers: [
                    { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
                    { key: 'Cache-Control', value: 'no-store' },
                    { key: 'Referrer-Policy', value: 'no-referrer' },
                ],
            },
        ];
    },
    async redirects() {
        return [
            // /demo was a sales contact form, not a product demo. Renamed to
            // /contact; keep the old URL working for anything already linking it.
            { source: '/demo', destination: '/contact', permanent: true },
            { source: '/id/demo', destination: '/id/contact', permanent: true },
        ];
    },
};

export default withNextIntl(nextConfig);