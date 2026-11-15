import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin/session';
import { serializeOutcomes } from '@/lib/admin/text';
import { getProjectsForAdmin, SECTORS } from '@/data/projects';
import { deleteProject, saveProject } from '../../../actions';
import { ActionForm } from '../../../_components/ActionForm';
import { ConfirmButton } from '../../../_components/ConfirmButton';
import { ImageField } from '../../../_components/ImageField';
import { Checkbox, Field, inputClass, PageHeader, Section } from '../../../_components/ui';
import { SECTOR_LABELS } from '../sectors';
import { ProjectImages } from './ProjectImages';

const ONE_PER_LINE = 'One per line.';

export default async function ProjectEditor({
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
    const project = isNew ? null : (await getProjectsForAdmin(slug))[0];
    if (!isNew && !project) notFound();

    return (
        <>
            <PageHeader
                title={project ? project.title : 'New project'}
                back={{ href: '/admin/work', label: 'Work' }}
                actions={
                    project && (
                        <>
                            {project.isPublished && (
                                <a href={`/portfolio/${project.slug}`} target="_blank" rel="noreferrer" className="text-sm text-slate-500 hover:text-slate-900">
                                    View live ↗
                                </a>
                            )}
                            <ConfirmButton action={deleteProject.bind(null, project.slug)} />
                        </>
                    )
                }
            />

            <ActionForm
                key={project?.slug ?? 'new'}
                action={saveProject.bind(null, project?.slug ?? null)}
                submitLabel={isNew ? 'Create project' : 'Save changes'}
                initialMessage={saved ? 'Saved.' : undefined}
            >
                <Section title="Project">
                    <Field label="Title" htmlFor="title">
                        <input id="title" name="title" required defaultValue={project?.title} className={inputClass} />
                    </Field>
                    <Field label="Summary" htmlFor="summary" hint="One or two sentences shown on /portfolio.">
                        <textarea id="summary" name="summary" rows={3} defaultValue={project?.summary} className={inputClass} />
                    </Field>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Sector" htmlFor="sector">
                            <select id="sector" name="sector" required defaultValue={project?.sector ?? ''} className={inputClass}>
                                <option value="" disabled>Choose a sector</option>
                                {SECTORS.map((s) => <option key={s} value={s}>{SECTOR_LABELS[s]}</option>)}
                            </select>
                        </Field>
                        <Field label="Slug" htmlFor="slug" hint="The URL: /portfolio/<slug>. Made from the title when empty.">
                            <input id="slug" name="slug" defaultValue={project?.slug} className={inputClass} />
                        </Field>
                    </div>
                </Section>

                <Section title="Client">
                    <Checkbox
                        name="isConfidential"
                        label="Confidential: hide the client name, logo, quote name and confidential images"
                        defaultChecked={project?.isConfidential ?? true}
                    />
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Client name" htmlFor="clientName" hint="Hidden on the site while the project is confidential.">
                            <input id="clientName" name="clientName" defaultValue={project?.clientName ?? ''} className={inputClass} />
                        </Field>
                        <Field label="Client description" htmlFor="clientClassification" hint="Always shown. For example: a regional bank in Indonesia.">
                            <input id="clientClassification" name="clientClassification" defaultValue={project?.clientClassification} className={inputClass} />
                        </Field>
                    </div>
                    <Field label="Client logo" htmlFor="clientLogoUrl">
                        <ImageField id="clientLogoUrl" name="clientLogoUrl" folder="projects" defaultValue={project?.clientLogoUrl} />
                    </Field>
                </Section>

                <Section title="Case study">
                    <Field label="The challenge" htmlFor="challenge">
                        <textarea id="challenge" name="challenge" rows={4} defaultValue={project?.challenge ?? ''} className={inputClass} />
                    </Field>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Constraints" htmlFor="constraints" hint={`${ONE_PER_LINE} Named regulations, e.g. POJK 11/2022.`}>
                            <textarea id="constraints" name="constraints" rows={4} defaultValue={project?.constraints.join('\n')} className={inputClass} />
                        </Field>
                        <Field label="What we built" htmlFor="built" hint={ONE_PER_LINE}>
                            <textarea id="built" name="built" rows={4} defaultValue={project?.built.join('\n')} className={inputClass} />
                        </Field>
                        <Field label="Highlights" htmlFor="highlights" hint={ONE_PER_LINE}>
                            <textarea id="highlights" name="highlights" rows={4} defaultValue={project?.highlights.join('\n')} className={inputClass} />
                        </Field>
                        <Field label="Outcomes" htmlFor="outcomes" hint={<>One per line as <code>value | label</code>, e.g. <code>99.95% | uptime in year one</code>.</>}>
                            <textarea id="outcomes" name="outcomes" rows={4} defaultValue={serializeOutcomes(project?.outcomes ?? [])} className={inputClass} />
                        </Field>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-3">
                        <Field label="Our role" htmlFor="role">
                            <input id="role" name="role" placeholder="Architecture, build and operations" defaultValue={project?.role ?? ''} className={inputClass} />
                        </Field>
                        <Field label="Team" htmlFor="team">
                            <input id="team" name="team" placeholder="4 engineers, 1 principal" defaultValue={project?.team ?? ''} className={inputClass} />
                        </Field>
                        <Field label="Duration" htmlFor="duration">
                            <input id="duration" name="duration" placeholder="7 months, 2025" defaultValue={project?.duration ?? ''} className={inputClass} />
                        </Field>
                    </div>
                    <Field label="Tech stack" htmlFor="techStack" hint="Separate with commas.">
                        <input id="techStack" name="techStack" defaultValue={project?.techStack.join(', ')} className={inputClass} />
                    </Field>
                </Section>

                <Section title="Client quote (optional)">
                    <Field label="Quote" htmlFor="quoteText" hint="Leave empty for no quote.">
                        <textarea id="quoteText" name="quoteText" rows={3} defaultValue={project?.quote?.text ?? ''} className={inputClass} />
                    </Field>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Name" htmlFor="quoteName" hint="Hidden while the project is confidential.">
                            <input id="quoteName" name="quoteName" defaultValue={project?.quote?.name ?? ''} className={inputClass} />
                        </Field>
                        <Field label="Role" htmlFor="quoteRole">
                            <input id="quoteRole" name="quoteRole" defaultValue={project?.quote?.role ?? ''} className={inputClass} />
                        </Field>
                    </div>
                </Section>

                <Section title="Visibility">
                    <div className="flex flex-wrap gap-6">
                        <Checkbox name="isPublished" label="Published (visible on the site)" defaultChecked={project?.isPublished ?? false} />
                        <Checkbox name="isFeatured" label="Featured on the home page" defaultChecked={project?.isFeatured ?? false} />
                    </div>
                    <Field label="Sort order" htmlFor="sortOrder" hint="Lower numbers come first on /portfolio." className="max-w-40">
                        <input id="sortOrder" name="sortOrder" type="number" step={1} defaultValue={project?.sortOrder ?? 0} className={inputClass} />
                    </Field>
                </Section>
            </ActionForm>

            {project ? (
                <ProjectImages slug={project.slug} images={project.images} />
            ) : (
                <p className="mt-8 text-sm text-slate-500">Create the project first, then add its gallery images.</p>
            )}
        </>
    );
}
