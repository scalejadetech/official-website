import { MetadataRoute } from 'next';

const BASE_URL = 'https://scalejade.com';
const locales = ['en', 'id'] as const;

const serviceslugs = [
    'software-engineering',
    'artificial-intelligence',
    'data-analytics',
    'cloud-infrastructure',
    'blockchain',
];

const staticRoutes = [
    '',
    '/services',
    '/sectors',
    '/portfolio',
    '/about',
    '/demo',
];

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const staticEntries = staticRoutes.flatMap(route =>
        locales.map(locale => ({
            url: `${BASE_URL}/${locale}${route}`,
            lastModified: now,
            changeFrequency: route === '' ? ('weekly' as const) : ('monthly' as const),
            priority: route === '' ? 1.0 : route === '/services' ? 0.9 : 0.8,
            alternates: {
                languages: {
                    en: `${BASE_URL}/en${route}`,
                    id: `${BASE_URL}/id${route}`,
                },
            },
        }))
    );

    const serviceEntries = serviceslugs.flatMap(slug =>
        locales.map(locale => ({
            url: `${BASE_URL}/${locale}/services/${slug}`,
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: 0.85,
            alternates: {
                languages: {
                    en: `${BASE_URL}/en/services/${slug}`,
                    id: `${BASE_URL}/id/services/${slug}`,
                },
            },
        }))
    );

    return [...staticEntries, ...serviceEntries];
}
