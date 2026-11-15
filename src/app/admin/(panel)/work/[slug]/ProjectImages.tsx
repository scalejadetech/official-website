import { IMAGE_KINDS, type ProjectImage } from '@/data/projects';
import { addProjectImage, deleteProjectImage, updateProjectImage } from '../../../actions';
import { ActionForm } from '../../../_components/ActionForm';
import { ConfirmButton } from '../../../_components/ConfirmButton';
import { ImageField } from '../../../_components/ImageField';
import { Checkbox, Field, inputClass } from '../../../_components/ui';
import { MultiImageUpload } from './MultiImageUpload';

function ImageFields({ image }: { image?: ProjectImage }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Alt text" hint="Describe the image for screen readers.">
                <input name="alt" defaultValue={image?.alt} className={inputClass} />
            </Field>
            <Field label="Caption">
                <input name="caption" defaultValue={image?.caption ?? ''} className={inputClass} />
            </Field>
            <Field label="Kind">
                <select name="kind" defaultValue={image?.kind ?? 'other'} className={inputClass}>
                    {IMAGE_KINDS.map((k) => <option key={k} value={k}>{k[0].toUpperCase() + k.slice(1)}</option>)}
                </select>
            </Field>
            <Field label="Sort order">
                <input name="sortOrder" type="number" step={1} defaultValue={image?.sortOrder} placeholder="Last" className={inputClass} />
            </Field>
            <div className="sm:col-span-2">
                <Checkbox
                    name="isConfidential"
                    label="Confidential: hide while the project is confidential (e.g. shows client branding)"
                    defaultChecked={image?.isConfidential ?? false}
                />
            </div>
        </div>
    );
}

export function ProjectImages({ slug, images }: { slug: string; images: ProjectImage[] }) {
    return (
        <section className="mt-12">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">Gallery images</h2>

            <ul className="grid gap-4">
                {images.map((img) => (
                    <li key={img.id} className="grid gap-5 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-[12rem_1fr]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt={img.alt} className="aspect-[4/3] w-full rounded-lg border border-slate-200 object-cover" />
                        <div>
                            <ActionForm action={updateProjectImage.bind(null, slug, img.id)} submitLabel="Save image" className="grid gap-4">
                                <ImageFields image={img} />
                            </ActionForm>
                            <div className="mt-3">
                                <ConfirmButton action={deleteProjectImage.bind(null, slug, img.id)} label="Remove image" confirmLabel="Click again to remove" />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="mb-4 text-sm font-semibold">Add images</h3>
                <MultiImageUpload slug={slug} kinds={IMAGE_KINDS} />

                <details className="mt-6 border-t border-slate-200 pt-4">
                    <summary className="cursor-pointer text-sm font-medium text-slate-700">Add one image by URL (e.g. Unsplash)</summary>
                    {/* Keyed by the image count so the form clears once an image is added. */}
                    <ActionForm key={images.length} action={addProjectImage.bind(null, slug)} submitLabel="Add image" className="mt-4 grid gap-4">
                        <Field label="Image">
                            <ImageField name="url" folder="projects" />
                        </Field>
                        <ImageFields />
                    </ActionForm>
                </details>
            </div>
        </section>
    );
}
