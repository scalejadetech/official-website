import { useTranslations } from 'next-intl';
import { Cpu, ShieldCheck, CloudCog, ChevronRight, Code2 } from 'lucide-react';
import * as motion from "framer-motion/client";

export default function ServicesPage() {
    const t = useTranslations('ServiceDetails');
    const s = useTranslations('Services');

    const services = [
        { id: 'software', title: s('software_title'), desc: t('software_desc'), icon: Code2 },
        { id: 'ai', title: s('ai_title'), desc: t('ai_desc'), icon: Cpu },
        { id: 'blockchain', title: s('blockchain_title'), desc: t('blockchain_desc'), icon: ShieldCheck },
        { id: 'infra', title: s('infra_title'), desc: t('infra_desc'), icon: CloudCog },
    ];

    return (
        <div className="min-h-screen bg-canvas py-24 px-6" role="main">
            <div className="max-w-7xl mx-auto">

                {/* Structured Data - JSON-LD for Services Page */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "ServicesPage",
                            "name": "ScaleJade Services",
                            "description": "Enterprise software development, AI systems, blockchain networks, and cloud infrastructure solutions",
                            "mainEntity": {
                                "@type": "ItemList",
                                "name": "Our Services",
                                "itemListElement": [
                                    {
                                        "@type": "ListItem",
                                        "position": 1,
                                        "name": "Software Engineering",
                                        "description": "Custom software tailored to enterprise workflows"
                                    },
                                    {
                                        "@type": "ListItem",
                                        "position": 2,
                                        "name": "Artificial Intelligence",
                                        "description": "AI systems that provide measurable business advantage"
                                    },
                                    {
                                        "@type": "ListItem",
                                        "position": 3,
                                        "name": "Blockchain & Distributed Ledger",
                                        "description": "Transparent, auditable ledger infrastructure"
                                    },
                                    {
                                        "@type": "ListItem",
                                        "position": 4,
                                        "name": "Cloud Infrastructure",
                                        "description": "Secure, compliant cloud environments"
                                    }
                                ]
                            }
                        })
                    }}
                />

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mb-24"
                >
                    <span className="text-scalejade-600 font-semibold tracking-wide uppercase text-sm mb-4 block">
                        {t('header_badge')}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                        {t('header_title')}
                    </h1>
                    <p className="text-lg text-slate-500 font-light leading-relaxed">
                        {t('header_sub')}
                    </p>
                </motion.div>

                {/* Technical Capabilities Grid */}
                <section aria-labelledby="services-heading">
                    <h2 id="services-heading" className="sr-only">Our Services</h2>
                    <div className="grid grid-cols-1 gap-12">
                        {services.map((service, idx) => {
                            const Icon = service.icon;
                            return (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group flex flex-col md:flex-row gap-8 items-start p-10 border-l-2 border-scalejade-800/10 hover:border-scalejade-600 bg-surface/50 hover:bg-surface transition-all rounded-r-2xl"
                                >
                                    <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl text-scalejade-800">
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                                            {service.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed max-w-4xl mb-6">
                                            {service.desc}
                                        </p>
                                        <button className="flex items-center gap-2 text-sm font-semibold text-scalejade-800 hover:text-scalejade-600 transition-colors" aria-label={`View technical documentation for ${service.title}`}>
                                            View Technical Documentation <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

            </div>
        </div>
    );
}