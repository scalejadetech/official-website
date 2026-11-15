import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin/session';
import { getArticle } from '@/lib/admin/data';
import { serializeSections } from '@/lib/admin/text';
import { BLOG_CATEGORIES } from '@/data/blog';
import { deleteArticle, saveArticle } from '../../../../actions';
import { ActionForm } from '../../../../_components/ActionForm';
import { ConfirmButton } from '../../../../_components/ConfirmButton';
import { ImageField } from '../../../../_components/ImageField';
import { Checkbox, Field, inputClass, PageHeader, Section } from '../../../../_components/ui';
import { BODY_HINT } from '../../body-hint';

export default async function ArticleEditor({
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
    const article = isNew ? null : await getArticle(slug);
    if (!isNew && !article) notFound();

    const today = new Date().toISOString().slice(0, 10);

    return (
        <>
            <PageHeader
                title={article ? article.title : 'New article'}
                back={{ href: '/admin/insights', label: 'Insights' }}
                actions={
                    article && (
                        <>
                            {article.isPublished && (
                                <a href={`/blog/${article.slug}`} target="_blank" rel="noreferrer" className="text-sm text-slate-500 hover:text-slate-900">
                                    View live ↗
                                </a>
                            )}
                            <ConfirmButton action={deleteArticle.bind(null, article.slug)} />
                        </>
                    )
                }
            />

            <ActionForm
                key={article?.slug ?? 'new'}
                action={saveArticle.bind(null, article?.slug ?? null)}
                submitLabel={isNew ? 'Create article' : 'Save changes'}
                initialMessage={saved ? 'Saved.' : undefined}
            >
                <Section title="Article">
                    <Field label="Title" htmlFor="title">
                        <input id="title" name="title" required defaultValue={article?.title} className={inputClass} />
                    </Field>
                    <Field label="Excerpt" htmlFor="excerpt" hint="One or two sentences shown on the Insights list.">
                        <textarea id="excerpt" name="excerpt" rows={2} defaultValue={article?.excerpt} className={inputClass} />
                    </Field>
                    <Field label="Body" htmlFor="body" hint={BODY_HINT}>
                        <textarea
                            id="body"
                            name="body"
                            rows={22}
                            defaultValue={serializeSections(article?.sections)}
                            className={`${inputClass} font-mono text-[13px] leading-relaxed`}
                        />
                    </Field>
                    <Field label="Cover image" htmlFor="coverImage" hint="Optional. Without one, the article uses a photo for its category.">
                        <ImageField id="coverImage" name="coverImage" folder="blog" defaultValue={article?.coverImage} />
                    </Field>
                </Section>

                <Section title="Details">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Category" htmlFor="category">
                            <input id="category" name="category" list="categories" defaultValue={article?.category} className={inputClass} />
                            <datalist id="categories">
                                {BLOG_CATEGORIES.map((c) => <option key={c} value={c} />)}
                            </datalist>
                        </Field>
                        <Field label="Author" htmlFor="author">
                            <input id="author" name="author" defaultValue={article?.author ?? 'ScaleJade'} className={inputClass} />
                        </Field>
                        <Field label="Date" htmlFor="date">
                            <input id="date" name="date" type="date" required defaultValue={article?.date ?? today} className={inputClass} />
                        </Field>
                        <Field label="Reading time" htmlFor="readingTime" hint="Leave empty to work it out from the body.">
                            <input id="readingTime" name="readingTime" placeholder="5 min read" defaultValue={article?.readingTime} className={inputClass} />
                        </Field>
                        <Field label="Slug" htmlFor="slug" hint="The URL: /blog/<slug>. Made from the title when empty." className="sm:col-span-2">
                            <input id="slug" name="slug" defaultValue={article?.slug} className={inputClass} />
                        </Field>
                    </div>
                    <Checkbox name="isPublished" label="Published (visible on the site)" defaultChecked={article?.isPublished ?? false} />
                </Section>
            </ActionForm>
        </>
    );
}
