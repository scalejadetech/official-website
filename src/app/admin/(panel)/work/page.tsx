import Link from 'next/link';
import { requireAdmin } from '@/lib/admin/session';
import { getProjectsForAdmin } from '@/data/projects';
import { deleteProject, setProjectFlag } from '../../actions';
import { ConfirmButton } from '../../_components/ConfirmButton';
import { buttonClass, PageHeader, Status } from '../../_components/ui';
import { SECTOR_LABELS } from './sectors';

export default async function WorkAdmin() {
    await requireAdmin();
    const projects = await getProjectsForAdmin();

    return (
        <>
            <PageHeader
                title="Work"
                actions={<Link href="/admin/work/new" className={buttonClass.primary}>New project</Link>}
            />
            <p className="-mt-4 mb-6 text-sm text-slate-500">Shown on /portfolio in this order (lowest sort number first).</p>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-5 py-3 font-medium">#</th>
                            <th className="px-5 py-3 font-medium">Project</th>
                            <th className="px-5 py-3 font-medium">Sector</th>
                            <th className="px-5 py-3 font-medium">Client</th>
                            <th className="px-5 py-3 font-medium">Status</th>
                            <th className="px-5 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {projects.map((p) => (
                            <tr key={p.slug}>
                                <td className="px-5 py-3 text-slate-500 tabular-nums">{p.sortOrder}</td>
                                <td className="max-w-sm px-5 py-3">
                                    <Link href={`/admin/work/${p.slug}`} className="font-medium hover:text-scalejade-700">{p.title}</Link>
                                    {p.isFeatured && (
                                        <span className="ml-2 rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">Featured</span>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-5 py-3 text-slate-600">{SECTOR_LABELS[p.sector]}</td>
                                <td className="px-5 py-3 text-slate-600">
                                    {p.isConfidential ? (
                                        <span title={p.clientName ?? undefined}>{p.clientClassification || 'Confidential'} · hidden</span>
                                    ) : (
                                        p.clientName ?? '—'
                                    )}
                                </td>
                                <td className="px-5 py-3"><Status published={p.isPublished} /></td>
                                <td className="whitespace-nowrap px-5 py-3">
                                    <div className="flex items-center justify-end gap-3">
                                        {p.isPublished && (
                                            <a href={`/portfolio/${p.slug}`} target="_blank" rel="noreferrer" className="text-sm text-slate-500 hover:text-slate-900">View ↗</a>
                                        )}
                                        <form action={setProjectFlag.bind(null, p.slug, 'is_published', !p.isPublished)}>
                                            <button className={buttonClass.link}>{p.isPublished ? 'Unpublish' : 'Publish'}</button>
                                        </form>
                                        <Link href={`/admin/work/${p.slug}`} className={buttonClass.secondary}>Edit</Link>
                                        <ConfirmButton action={deleteProject.bind(null, p.slug)} confirmLabel="Confirm delete" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {projects.length === 0 && (
                            <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">No projects yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
