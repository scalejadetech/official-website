import Link from 'next/link';
import { requireAdmin } from '@/lib/admin/session';
import { listArticles, listPapers } from '@/lib/admin/data';
import { getProjectsForAdmin } from '@/data/projects';
import { buttonClass, PageHeader, Status } from '../_components/ui';

export default async function Overview() {
    await requireAdmin();
    const [articles, papers, projects] = await Promise.all([listArticles(), listPapers(), getProjectsForAdmin()]);

    const cards = [
        { label: 'Articles', items: articles, href: '/admin/insights?type=articles' },
        { label: 'Research papers', items: papers, href: '/admin/insights?type=papers' },
        { label: 'Projects', items: projects, href: '/admin/work' },
    ];

    return (
        <>
            <PageHeader
                title="Overview"
                actions={
                    <>
                        <Link href="/admin/insights/articles/new" className={buttonClass.secondary}>New article</Link>
                        <Link href="/admin/work/new" className={buttonClass.primary}>New project</Link>
                    </>
                }
            />

            <dl className="grid gap-4 sm:grid-cols-3">
                {cards.map(({ label, items, href }) => {
                    const drafts = items.filter((i) => !i.isPublished).length;
                    return (
                        <Link key={label} href={href} className="rounded-xl border border-slate-200 bg-white p-6 hover:border-slate-300">
                            <dt className="text-sm text-slate-600">{label}</dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight">{items.length - drafts}</dd>
                            <dd className="mt-1 text-xs text-slate-500">
                                published{drafts > 0 && ` · ${drafts} draft${drafts === 1 ? '' : 's'}`}
                            </dd>
                        </Link>
                    );
                })}
            </dl>

            <section className="mt-10">
                <h2 className="mb-3 text-sm font-semibold text-slate-900">Latest articles</h2>
                <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                    {articles.slice(0, 6).map((a) => (
                        <li key={a.slug} className="flex items-center gap-4 px-5 py-3">
                            <Link href={`/admin/insights/articles/${a.slug}`} className="min-w-0 flex-1 truncate text-sm font-medium hover:text-scalejade-700">
                                {a.title}
                            </Link>
                            <span className="hidden text-xs text-slate-500 sm:inline">{a.date}</span>
                            <Status published={a.isPublished} />
                        </li>
                    ))}
                    {articles.length === 0 && <li className="px-5 py-6 text-sm text-slate-500">No articles yet.</li>}
                </ul>
            </section>
        </>
    );
}
