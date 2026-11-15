import Link from 'next/link';
import { requireAdmin } from '@/lib/admin/session';
import { listArticles, listPapers } from '@/lib/admin/data';
import { deleteArticle, deletePaper, setArticlePublished, setPaperPublished } from '../../actions';
import { ConfirmButton } from '../../_components/ConfirmButton';
import { buttonClass, inputClass, PageHeader, Status } from '../../_components/ui';

type Row = { kind: 'article' | 'paper'; slug: string; title: string; meta: string; date: string; isPublished: boolean };

const TYPES = ['all', 'articles', 'papers'] as const;
const STATUSES = ['all', 'published', 'draft'] as const;

export default async function InsightsAdmin({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; type?: string; status?: string }>;
}) {
    await requireAdmin();
    const { q = '', type = 'all', status = 'all' } = await searchParams;
    const [articles, papers] = await Promise.all([listArticles(), listPapers()]);

    const rows: Row[] = [
        ...(type === 'papers'
            ? []
            : articles.map((a) => ({ kind: 'article' as const, slug: a.slug, title: a.title, meta: a.category || '—', date: a.date, isPublished: a.isPublished }))),
        ...(type === 'articles'
            ? []
            : papers.map((p) => ({ kind: 'paper' as const, slug: p.slug, title: p.title, meta: 'Research paper', date: p.date, isPublished: p.isPublished }))),
    ]
        .filter((r) => (status === 'published' ? r.isPublished : status === 'draft' ? !r.isPublished : true))
        .filter((r) => !q || `${r.title} ${r.slug} ${r.meta}`.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => b.date.localeCompare(a.date));

    return (
        <>
            <PageHeader
                title="Insights"
                actions={
                    <>
                        <Link href="/admin/insights/papers/new" className={buttonClass.secondary}>New paper</Link>
                        <Link href="/admin/insights/articles/new" className={buttonClass.primary}>New article</Link>
                    </>
                }
            />

            <form className="mb-4 grid gap-2 sm:grid-cols-[minmax(0,20rem)_auto_auto_auto] sm:justify-start">
                <input name="q" defaultValue={q} placeholder="Search title or slug" className={inputClass} />
                <select name="type" defaultValue={type} className={inputClass}>
                    {TYPES.map((t) => <option key={t} value={t}>{t === 'all' ? 'Articles and papers' : t[0].toUpperCase() + t.slice(1)}</option>)}
                </select>
                <select name="status" defaultValue={status} className={inputClass}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s === 'all' ? 'Any status' : s[0].toUpperCase() + s.slice(1)}</option>)}
                </select>
                <button className={`${buttonClass.secondary} justify-center`}>Filter</button>
            </form>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-5 py-3 font-medium">Title</th>
                            <th className="px-5 py-3 font-medium">Type</th>
                            <th className="px-5 py-3 font-medium">Date</th>
                            <th className="px-5 py-3 font-medium">Status</th>
                            <th className="px-5 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {rows.map((r) => {
                            const edit = `/admin/insights/${r.kind === 'article' ? 'articles' : 'papers'}/${r.slug}`;
                            const live = r.kind === 'article' ? `/blog/${r.slug}` : `/research/${r.slug}`;
                            const toggle = r.kind === 'article' ? setArticlePublished : setPaperPublished;
                            return (
                                <tr key={`${r.kind}-${r.slug}`}>
                                    <td className="max-w-md px-5 py-3">
                                        <Link href={edit} className="font-medium hover:text-scalejade-700">{r.title}</Link>
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-3 text-slate-600">{r.meta}</td>
                                    <td className="whitespace-nowrap px-5 py-3 text-slate-600">{r.date}</td>
                                    <td className="px-5 py-3"><Status published={r.isPublished} /></td>
                                    <td className="whitespace-nowrap px-5 py-3 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {r.isPublished && (
                                                <a href={live} target="_blank" rel="noreferrer" className="text-sm text-slate-500 hover:text-slate-900">View ↗</a>
                                            )}
                                            <form action={toggle.bind(null, r.slug, !r.isPublished)}>
                                                <button className={buttonClass.link}>{r.isPublished ? 'Unpublish' : 'Publish'}</button>
                                            </form>
                                            <Link href={edit} className={buttonClass.secondary}>Edit</Link>
                                            <ConfirmButton
                                                action={(r.kind === 'article' ? deleteArticle : deletePaper).bind(null, r.slug)}
                                                confirmLabel="Confirm delete"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {rows.length === 0 && (
                            <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-500">Nothing matches.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
