import { useTranslations } from 'next-intl';
import { Cpu, ShieldCheck, CloudCog, ChevronRight, Code2, ArrowRight } from 'lucide-react';
import * as motion from "framer-motion/client";

export default function ServicesPage() {
    const t = useTranslations('ServiceDetails');
    const s = useTranslations('Services');
    const a = useTranslations('ServiceApproach');

    const services = [
        { id: 'software', title: s('software_title'), desc: t('software_desc'), icon: Code2 },
        { id: 'ai', title: s('ai_title'), desc: t('ai_desc'), icon: Cpu },
        { id: 'blockchain', title: s('blockchain_title'), desc: t('blockchain_desc'), icon: ShieldCheck },
        { id: 'infra', title: s('infra_title'), desc: t('infra_desc'), icon: CloudCog },
    ];

    const pillars = [
        {
            title: 'Engineering Depth',
            body: 'Our teams are practitioners, not generalists. Every engagement is led by engineers who have built production systems at scale and carry that accountability into your project.',
        },
        {
            title: 'Domain Context',
            body: 'We operate at the intersection of technology and regulated industry. We understand compliance constraints, data governance requirements, and the operational realities your teams live with daily.',
        },
        {
            title: 'Built to Last',
            body: 'We design for the conditions that actually matter — not the average day, but the critical one. Systems we ship are designed to hold up under real-world load, evolving requirements, and regulatory scrutiny.',
        },
    ];

    return (
        <div className="min-h-screen bg-canvas" role="main">

            {/* Structured Data */}
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
                                { "@type": "ListItem", "position": 1, "name": "Software Engineering", "description": "Custom software tailored to enterprise workflows" },
                                { "@type": "ListItem", "position": 2, "name": "Artificial Intelligence", "description": "AI systems that provide measurable business advantage" },
                                { "@type": "ListItem", "position": 3, "name": "Blockchain & Distributed Ledger", "description": "Transparent, auditable ledger infrastructure" },
                                { "@type": "ListItem", "position": 4, "name": "Cloud Infrastructure", "description": "Secure, compliant cloud environments" },
                            ],
                        },
                    })
                }}
            />

            {/* ── 1. Header + Services Grid ── */}
            <div className="pt-24 pb-32 px-6">
                <div className="max-w-7xl mx-auto">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mb-20"
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

                    <section aria-labelledby="services-heading">
                        <h2 id="services-heading" className="sr-only">Our Services</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {services.map((service, idx) => {
                                const Icon = service.icon;
                                return (
                                    <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.08 }}
                                        className="group flex flex-col gap-6 p-8 border border-slate-200 rounded-2xl bg-white hover:shadow-xl hover:shadow-scalejade-900/5 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-scalejade-900 text-white rounded-xl group-hover:bg-scalejade-600 transition-colors shrink-0">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                                                {service.title}
                                            </h3>
                                        </div>
                                        <p className="text-slate-600 leading-relaxed text-sm flex-1">
                                            {service.desc}
                                        </p>
                                        <button
                                            className="flex items-center gap-2 text-xs font-semibold text-scalejade-800 hover:text-scalejade-600 transition-colors mt-auto"
                                            aria-label={`View technical documentation for ${service.title}`}
                                        >
                                            View Technical Documentation <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>

            {/* ── 2. Our Competitive Edge ── */}
            <section className="bg-scalejade-900 py-28 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-white font-bold tracking-widest uppercase text-xs mb-6 block">
                            {a('advantage_label')}
                        </span>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight whitespace-pre-line max-w-2xl">
                            {a('advantage_title')}
                        </h2>
                    </motion.div>

                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-scalejade-800/40 rounded-2xl overflow-hidden border border-scalejade-800/40">
                        {pillars.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-scalejade-900 p-10 flex flex-col gap-5"
                            >
                                <h3 className="text-white font-bold text-xl tracking-tight">{item.title}</h3>
                                <p className="text-white/80 leading-relaxed text-sm">{item.body}</p>
                                <ArrowRight className="w-4 h-4 text-white/40 mt-auto" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 3. Our Method ── */}
            <section className="bg-white border-t border-slate-100 py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-[220px_1fr] gap-10 items-start bg-slate-50 rounded-3xl px-10 py-14 md:px-16 md:py-16 border border-slate-100"
                    >
                        <div className="pt-1">
                            <span className="text-scalejade-600 font-bold tracking-widest uppercase text-xs">
                                {a('label')}
                            </span>
                        </div>
                        <p className="text-2xl md:text-3xl text-slate-800 font-medium leading-snug tracking-tight">
                            {a('body')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── 4. From the Field ── */}
            <section className="bg-white border-t border-slate-100 py-24 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="md:sticky md:top-32"
                    >
                        <span className="text-scalejade-600 font-bold tracking-widest uppercase text-xs mb-4 block">
                            {a('story_label')}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                            {a('story_title')}
                        </h2>
                        <p className="text-lg text-slate-700 font-medium leading-relaxed border-l-4 border-scalejade-600 pl-5">
                            {a('story_intro')}
                        </p>
                        <div className="mt-10 flex items-center gap-3">
                            <div className="w-8 h-px bg-scalejade-900" />
                            <span className="text-xs text-slate-400 tracking-widest uppercase">ScaleJade Engineering</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6 text-slate-600 leading-relaxed text-[17px]"
                    >
                        <p>{a('story_p1')}</p>
                        <p>{a('story_p2')}</p>
                        <p className="font-medium text-slate-800">{a('story_p3')}</p>
                    </motion.div>
                </div>
            </section>

        </div>
    );
}
