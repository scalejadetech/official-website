import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin/session';
import { getPaper } from '@/lib/admin/data';
import { serializeSections } from '@/lib/admin/text';
import { deletePaper, savePaper } from '../../../../actions';
import { ActionForm } from '../../../../_components/ActionForm';
import { ConfirmButton } from '../../../../_components/ConfirmButton';
import { Checkbox, Field, inputClass, PageHeader, Section } from '../../../../_components/ui';
import { BODY_HINT } from '../../body-hint';

const LINKS = [
    { key: 'pdf', label: 'PDF' },
    { key: 'arxiv', label: 'arXiv' },
    { key: 'code', label: 'Code' },
    { key: 'dataset', label: 'Dataset' },
] as const;

export default async function PaperEditor({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ saved?: string }>;
}) {
    await requireAdmin();
    const { slug } = await params;
    const { saved } = await searchParams;
    const isNew = slug === 'new';
    const paper = isNew ? null : await getPaper(slug);
    if (!isNew && !paper) notFound();

    const today = new Date().toISOString().slice(0, 10);

    return (
        <>
            <PageHeader
                title={paper ? paper.title : 'New research paper'}
                back={{ href: '/admin/insights', label: 'Insights' }}
                actions={
                    paper && (
                        <>
                            {paper.isPublished && (
                                <a href={`/research/${paper.slug}`} target="_blank" rel="noreferrer" className="text-sm text-slate-500 hover:text-slate-900">
                                    View live ↗
                                </a>
                            )}
                            <ConfirmButton action={deletePaper.bind(null, paper.slug)} />
                        </>
                    )
                }
            />

            <ActionForm
                key={paper?.slug ?? 'new'}
                action={savePaper.bind(null, paper?.slug ?? null)}
                submitLabel={isNew ? 'Create paper' : 'Save changes'}
                initialMessage={saved ? 'Saved.' : undefined}
            >
                <Section title="Paper">
                    <Field label="Title" htmlFor="title">
                        <input id="title" name="title" required defaultValue={paper?.title} className={inputClass} />
                    </Field>
                    <Field label="Summary" htmlFor="summary" hint="One or two sentences shown on the Insights list.">
                        <textarea id="summary" name="summary" rows={2} defaultValue={paper?.summary} className={inputClass} />
                    </Field>
                    <Field label="Abstract" htmlFor="abstract">
                        <textarea id="abstract" name="abstract" rows={6} required defaultValue={paper?.abstract} className={inputClass} />
                    </Field>
                    <Field label="Body" htmlFor="body" hint={BODY_HINT}>
                        <textarea
                            id="body"
                            name="body"
                            rows={18}
                            defaultValue={serializeSections(paper?.sections)}
                            className={`${inputClass} font-mono text-[13px] leading-relaxed`}
                        />
                    </Field>
                </Section>

                <Section title="Details">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Authors" htmlFor="authors" hint="Separate with commas.">
                            <input id="authors" name="authors" defaultValue={paper?.authors.join(', ') ?? 'ScaleJade Research'} className={inputClass} />
                        </Field>
                        <Field label="Topics" htmlFor="topics" hint="Separate with commas. Used for the filter on /research.">
                            <input id="topics" name="topics" defaultValue={paper?.topics.join(', ')} className={inputClass} />
                        </Field>
                        <Field label="Date" htmlFor="date">
                            <input id="date" name="date" type="date" required defaultValue={paper?.date ?? today} className={inputClass} />
                        </Field>
                        <Field label="Venue" htmlFor="venue" hint="For example: Preprint · 2026">
                            <input id="venue" name="venue" defaultValue={paper?.venue ?? ''} className={inputClass} />
                        </Field>
                        {LINKS.map(({ key, label }) => (
                            <Field key={key} label={`${label} link`} htmlFor={`link_${key}`}>
                                <input id={`link_${key}`} name={`link_${key}`} type="url" placeholder="https://" defaultValue={paper?.links[key] ?? ''} className={inputClass} />
                            </Field>
                        ))}
                        <Field label="Slug" htmlFor="slug" hint="The URL: /research/<slug>. Made from the title when empty." className="sm:col-span-2">
                            <input id="slug" name="slug" defaultValue={paper?.slug} className={inputClass} />
                        </Field>
                        <Field label="BibTeX" htmlFor="bibtex" className="sm:col-span-2">
                            <textarea id="bibtex" name="bibtex" rows={5} defaultValue={paper?.bibtex ?? ''} className={`${inputClass} font-mono text-[13px]`} />
                        </Field>
                    </div>
                    <Checkbox name="isPublished" label="Published (visible on the site)" defaultChecked={paper?.isPublished ?? false} />
                </Section>
            </ActionForm>
        </>
    );
}
