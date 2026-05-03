import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import * as motion from "framer-motion/client";
import { ArrowRight, Code2, Cpu, ShieldCheck, CloudCog } from 'lucide-react';

import { TrustSection } from '@/components/TrustSection';

export default function HomePage() {
    const t = useTranslations('Hero');
    const c = useTranslations('Capabilities');
    const locale = useLocale();

    const capabilities = [
        { id: 'software', icon: Code2, title: c('software_title'), desc: c('software_desc'), link: c('software_link') },
        { id: 'ai',       icon: Cpu,   title: c('ai_title'),       desc: c('ai_desc'),       link: c('ai_link') },
        { id: 'blockchain', icon: ShieldCheck, title: c('blockchain_title'), desc: c('blockchain_desc'), link: c('blockchain_link') },
        { id: 'cloud',    icon: CloudCog, title: c('cloud_title'), desc: c('cloud_desc'),    link: c('cloud_link') },
    ];

    return (
        <main className="min-h-screen bg-canvas text-slate-900 selection:bg-scalejade-600 selection:text-white">
            {/* Structured Data - JSON-LD for Organization */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "ScaleJade",
                        "url": locale === 'en' ? "https://scalejade.com/en" : "https://scalejade.com/id",
                        "logo": "https://scalejade.com/scalejade-green-withtext.svg",
                        "sameAs": [
                            "https://x.com/ScaleJade",
                            "https://www.linkedin.com/company/scalejade"
                        ],
                        "description": "ScaleJade is a technology firm helping enterprises build reliable software, AI systems, blockchain networks, and cloud infrastructure — built to perform, built to last.",
                        "foundingDate": "2024",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Global"
                        },
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "Core Services",
                            "itemListElement": [
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Software Engineering",
                                        "description": "Custom software tailored to enterprise workflows, built to scale"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Artificial Intelligence",
                                        "description": "AI systems and intelligent data pipelines for measurable business advantage"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Blockchain & Distributed Ledger",
                                        "description": "Transparent, auditable ledger infrastructure for institutional record integrity"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Cloud Infrastructure",
                                        "description": "Secure, compliant cloud environments with zero-downtime architecture"
                                    }
                                }
                            ]
                        }
                    })
                }}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-scalejade-800/20 bg-surface text-scalejade-800 text-sm font-medium tracking-wide"
                >
                    <span className="w-2 h-2 rounded-full bg-scalejade-600 animate-pulse" />
                    {t('badge')}
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl"
                >
                    {t('title')}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl font-light tracking-wide leading-relaxed"
                >
                    {t('subtitle')}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-10 flex flex-col sm:flex-row gap-4"
                >
                    <Link
                        href={`/${locale}/services`}
                        className="bg-scalejade-600 hover:bg-scalejade-800 text-white px-8 py-4 rounded-md font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        {t('cta_primary')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href={`/${locale}/demo`}
                        className="bg-surface hover:bg-slate-100 text-slate-900 border border-slate-200 px-8 py-4 rounded-md font-medium transition-all flex items-center justify-center"
                    >
                        {t('cta_secondary')}
                    </Link>
                </motion.div>
            </section>

            <TrustSection />
            {/* Capabilities — Four Pillars */}
            <section className="py-28 px-6 border-t border-slate-100" aria-labelledby="capabilities-heading">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <span className="text-scalejade-600 font-semibold tracking-widest uppercase text-xs mb-5 block">
                            {c('section_label')}
                        </span>
                        <div className="flex flex-col md:flex-row md:items-end gap-10 md:gap-20">
                            <h2 id="capabilities-heading" className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight md:w-1/2 shrink-0">
                                {c('heading')}
                            </h2>
                            <p className="text-lg text-slate-500 font-light leading-relaxed md:w-1/2 md:pb-2">
                                {c('subheading')}
                            </p>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {capabilities.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.08 }}
                                    className="group p-10 border border-slate-100 rounded-xl bg-surface hover:bg-white hover:border-scalejade-600/20 hover:shadow-sm transition-all"
                                >
                                    <div className="mb-6 p-2.5 bg-white border border-slate-200 shadow-sm rounded-lg inline-block">
                                        <Icon className="w-5 h-5 text-scalejade-700" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 leading-relaxed mb-7 font-light text-sm">
                                        {item.desc}
                                    </p>
                                    <Link
                                        href={`/${locale}/services`}
                                        className="text-sm font-semibold text-scalejade-800 hover:text-scalejade-600 transition-colors"
                                        aria-label={`Learn more about ${item.title}`}
                                    >
                                        {item.link}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
}