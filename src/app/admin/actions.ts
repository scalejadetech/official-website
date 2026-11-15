'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { slugify } from '@/lib/api';
import { isAllowedImageUrl, verifyCoverImage } from '@/lib/images';
import { createUploadUrl, FOLDERS, pathFromPublicUrl, removeObject, type Folder } from '@/lib/media';
import { endSession, isConfigured, passwordMatches, requireAdmin, startSession } from '@/lib/admin/session';
import { estimateReadingTime, lines, list, parseOutcomes, parseSections } from '@/lib/admin/text';
import { imagePayloadToRow, payloadToRow, type ProjectPayload } from '@/data/projects';

// Every action here is a public POST endpoint, so each one starts with
// requireAdmin(). redirect() works by throwing, so it is never called inside try.

export type FormState = { error?: string; ok?: string } | undefined;

const str = (fd: FormData, key: string) => String(fd.get(key) ?? '').trim();
const strOrNull = (fd: FormData, key: string) => str(fd, key) || null;
const bool = (fd: FormData, key: string) => fd.get(key) === 'on';
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Public pages read Supabase on render; drop anything cached so edits show at once. */
function refresh() {
    revalidatePath('/', 'layout');
}

function dbError(error: { message: string; code?: string }): FormState {
    if (error.code === '23505') return { error: 'That slug is already used. Pick another one.' };
    return { error: error.message };
}

// ------------------------------------------------------------------ session

export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
    if (!isConfigured()) return { error: 'Sign-in is not set up: ADMIN_PASSWORD is missing on the server.' };
    if (!passwordMatches(String(fd.get('password') ?? ''))) {
        await new Promise((r) => setTimeout(r, 1000)); // slow down guessing
        return { error: 'Wrong password.' };
    }
    await startSession();
    redirect('/admin');
}

export async function logout() {
    await endSession();
    redirect('/admin/login');
}

// ------------------------------------------------------------------ uploads

/** A signed URL the browser PUTs an image to, straight into Supabase Storage. */
export async function createUpload(
    folder: string,
    contentType: string
): Promise<{ uploadUrl: string; url: string } | { error: string }> {
    await requireAdmin();
    if (!FOLDERS.includes(folder as Folder)) return { error: 'Unknown folder.' };
    const result = await createUploadUrl(folder, contentType);
    if ('error' in result) return { error: result.error };
    return { uploadUrl: result.uploadUrl, url: result.url };
}

function checkImages(urls: (string | null | undefined)[]): string | null {
    const bad = urls.find((u) => u && !isAllowedImageUrl(u));
    return bad ? `Images must be uploaded here or come from images.unsplash.com: ${bad}` : null;
}

// ------------------------------------------------------------------ articles

export async function saveArticle(originalSlug: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
    await requireAdmin();

    const title = str(fd, 'title');
    if (!title) return { error: 'Title is required.' };
    const slug = slugify(str(fd, 'slug') || title);
    if (!slug) return { error: 'The slug is empty.' };
    const date = str(fd, 'date');
    if (!DATE.test(date)) return { error: 'Date must be YYYY-MM-DD.' };

    const sections = parseSections(String(fd.get('body') ?? ''));
    if (!sections.some((s) => s.paragraphs.length)) return { error: 'Write the article body.' };

    let coverImage = strOrNull(fd, 'coverImage');
    const imageError = checkImages([coverImage, ...sections.map((s) => s.image)]);
    if (imageError) return { error: imageError };
    if (coverImage) {
        coverImage = await verifyCoverImage(coverImage);
        if (!coverImage) return { error: 'The cover image could not be found. Check the Unsplash URL.' };
    }

    const row = {
        slug,
        title,
        excerpt: str(fd, 'excerpt'),
        category: str(fd, 'category'),
        author: str(fd, 'author') || 'ScaleJade',
        published_at: date,
        reading_time: str(fd, 'readingTime') || estimateReadingTime(sections),
        cover_image: coverImage,
        sections,
        is_published: bool(fd, 'isPublished'),
    };

    const db = supabaseAdmin().from('blog_posts');
    const { error } = originalSlug ? await db.update(row).eq('slug', originalSlug) : await db.insert(row);
    if (error) return dbError(error);

    refresh();
    if (originalSlug !== slug) redirect(`/admin/insights/articles/${slug}?saved=1`);
    return { ok: 'Saved.' };
}

export async function setArticlePublished(slug: string, published: boolean) {
    await requireAdmin();
    await supabaseAdmin().from('blog_posts').update({ is_published: published }).eq('slug', slug);
    refresh();
}

export async function deleteArticle(slug: string) {
    await requireAdmin();
    const { data } = await supabaseAdmin()
        .from('blog_posts')
        .delete()
        .eq('slug', slug)
        .select('cover_image, sections')
        .maybeSingle();
    if (data) {
        const urls = [data.cover_image, ...((data.sections ?? []) as { image?: string }[]).map((s) => s.image)];
        await Promise.all(urls.map((u) => removeObject(pathFromPublicUrl(u))));
    }
    refresh();
    redirect('/admin/insights');
}

// ------------------------------------------------------------------ papers

export async function savePaper(originalSlug: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
    await requireAdmin();

    const title = str(fd, 'title');
    if (!title) return { error: 'Title is required.' };
    const abstract = str(fd, 'abstract');
    if (!abstract) return { error: 'Abstract is required.' };
    const slug = slugify(str(fd, 'slug') || title);
    if (!slug) return { error: 'The slug is empty.' };
    const date = str(fd, 'date');
    if (!DATE.test(date)) return { error: 'Date must be YYYY-MM-DD.' };

    const links: Record<string, string> = {};
    for (const key of ['pdf', 'arxiv', 'code', 'dataset']) {
        const value = str(fd, `link_${key}`);
        if (value && !/^https:\/\//.test(value)) return { error: `The ${key} link must start with https://` };
        if (value) links[key] = value;
    }

    const row = {
        slug,
        title,
        summary: str(fd, 'summary'),
        abstract,
        authors: list(str(fd, 'authors')).length ? list(str(fd, 'authors')) : ['ScaleJade Research'],
        published_at: date,
        topics: list(str(fd, 'topics')),
        venue: strOrNull(fd, 'venue'),
        links,
        sections: parseSections(String(fd.get('body') ?? '')).map((s) => ({
            heading: s.heading ?? '',
            paragraphs: s.paragraphs,
        })),
        bibtex: strOrNull(fd, 'bibtex'),
        is_published: bool(fd, 'isPublished'),
    };

    const db = supabaseAdmin().from('papers');
    const { error } = originalSlug ? await db.update(row).eq('slug', originalSlug) : await db.insert(row);
    if (error) return dbError(error);

    refresh();
    if (originalSlug !== slug) redirect(`/admin/insights/papers/${slug}?saved=1`);
    return { ok: 'Saved.' };
}

export async function setPaperPublished(slug: string, published: boolean) {
    await requireAdmin();
    await supabaseAdmin().from('papers').update({ is_published: published }).eq('slug', slug);
    refresh();
}

export async function deletePaper(slug: string) {
    await requireAdmin();
    await supabaseAdmin().from('papers').delete().eq('slug', slug);
    refresh();
    redirect('/admin/insights');
}

// ------------------------------------------------------------------ projects

export async function saveProject(originalSlug: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
    await requireAdmin();

    const quoteText = str(fd, 'quoteText');
    const payload: ProjectPayload = {
        title: str(fd, 'title'),
        slug: str(fd, 'slug') || str(fd, 'title'),
        summary: str(fd, 'summary'),
        sector: str(fd, 'sector'),
        clientName: strOrNull(fd, 'clientName'),
        clientClassification: str(fd, 'clientClassification'),
        clientLogoUrl: strOrNull(fd, 'clientLogoUrl'),
        isConfidential: bool(fd, 'isConfidential'),
        challenge: strOrNull(fd, 'challenge'),
        constraints: lines(str(fd, 'constraints')),
        built: lines(str(fd, 'built')),
        role: strOrNull(fd, 'role'),
        team: strOrNull(fd, 'team'),
        duration: strOrNull(fd, 'duration'),
        highlights: lines(str(fd, 'highlights')),
        outcomes: parseOutcomes(str(fd, 'outcomes')),
        techStack: list(str(fd, 'techStack')),
        quote: quoteText ? { text: quoteText, name: str(fd, 'quoteName'), role: str(fd, 'quoteRole') } : null,
        isPublished: bool(fd, 'isPublished'),
        isFeatured: bool(fd, 'isFeatured'),
        sortOrder: Number.parseInt(str(fd, 'sortOrder') || '0', 10) || 0,
    };
    if (!payload.title) return { error: 'Title is required.' };
    const imageError = checkImages([payload.clientLogoUrl]);
    if (imageError) return { error: imageError };

    const parsed = payloadToRow(payload, false);
    if ('error' in parsed) return { error: parsed.error.replace(/`/g, '') };
    const slug = parsed.row.slug as string;

    const db = supabaseAdmin().from('projects');
    const { error } = originalSlug ? await db.update(parsed.row).eq('slug', originalSlug) : await db.insert(parsed.row);
    if (error) return dbError(error);

    refresh();
    if (originalSlug !== slug) redirect(`/admin/work/${slug}?saved=1`);
    return { ok: 'Saved.' };
}

export async function setProjectFlag(slug: string, flag: 'is_published' | 'is_featured', value: boolean) {
    await requireAdmin();
    await supabaseAdmin().from('projects').update({ [flag]: value }).eq('slug', slug);
    refresh();
}

export async function deleteProject(slug: string) {
    await requireAdmin();
    const db = supabaseAdmin();
    const { data: project } = await db
        .from('projects')
        .select('id, client_logo_url, project_images(storage_path)')
        .eq('slug', slug)
        .maybeSingle();
    if (project) {
        await db.from('projects').delete().eq('id', project.id);
        const images = (project.project_images ?? []) as { storage_path: string | null }[];
        await Promise.all([
            ...images.map((img) => removeObject(img.storage_path)),
            removeObject(pathFromPublicUrl(project.client_logo_url)),
        ]);
    }
    refresh();
    redirect('/admin/work');
}

// ------------------------------------------------------------------ project images

async function projectId(slug: string): Promise<string | null> {
    const { data } = await supabaseAdmin().from('projects').select('id').eq('slug', slug).maybeSingle();
    return data?.id ?? null;
}

function imageFields(fd: FormData) {
    return {
        alt: str(fd, 'alt'),
        caption: strOrNull(fd, 'caption'),
        kind: str(fd, 'kind') || 'other',
        isConfidential: bool(fd, 'isConfidential'),
        sortOrder: Number.parseInt(str(fd, 'sortOrder') || '0', 10) || 0,
    };
}

/** The sort number after the project's last image, so new images go to the end. */
async function nextSortOrder(id: string): Promise<number> {
    const { data } = await supabaseAdmin()
        .from('project_images')
        .select('sort_order')
        .eq('project_id', id)
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle();
    return (data?.sort_order ?? 0) + 10;
}

/** Adds several already-uploaded images at once, in the order given, after the existing ones. */
export async function addProjectImages(
    slug: string,
    urls: string[],
    options: { kind: string; isConfidential: boolean }
): Promise<FormState> {
    await requireAdmin();
    if (urls.length === 0) return { error: 'No images to add.' };
    const imageError = checkImages(urls);
    if (imageError) return { error: imageError };

    const id = await projectId(slug);
    if (!id) return { error: 'Project not found.' };
    const start = await nextSortOrder(id);

    const rows: Record<string, unknown>[] = [];
    for (const [i, url] of urls.entries()) {
        const parsed = imagePayloadToRow(
            { url, kind: options.kind, isConfidential: options.isConfidential, sortOrder: start + i * 10 },
            false
        );
        if ('error' in parsed) return { error: parsed.error.replace(/`/g, '') };
        rows.push({ ...parsed.row, project_id: id, storage_path: pathFromPublicUrl(url) });
    }

    const { error } = await supabaseAdmin().from('project_images').insert(rows);
    if (error) return { error: error.message };

    refresh();
    return { ok: `${urls.length} image${urls.length === 1 ? '' : 's'} added. Add alt text below.` };
}

export async function addProjectImage(slug: string, _prev: FormState, fd: FormData): Promise<FormState> {
    await requireAdmin();
    const url = str(fd, 'url');
    if (!url) return { error: 'Upload an image or paste its URL.' };
    const imageError = checkImages([url]);
    if (imageError) return { error: imageError };

    const id = await projectId(slug);
    if (!id) return { error: 'Project not found.' };

    const fields = imageFields(fd);
    if (!str(fd, 'sortOrder')) fields.sortOrder = await nextSortOrder(id);
    const parsed = imagePayloadToRow({ url, ...fields }, false);
    if ('error' in parsed) return { error: parsed.error.replace(/`/g, '') };

    const { error } = await supabaseAdmin()
        .from('project_images')
        .insert({ ...parsed.row, project_id: id, storage_path: pathFromPublicUrl(url) });
    if (error) return { error: error.message };

    refresh();
    return { ok: 'Image added.' };
}

export async function updateProjectImage(slug: string, imageId: string, _prev: FormState, fd: FormData): Promise<FormState> {
    await requireAdmin();
    const id = await projectId(slug);
    if (!id) return { error: 'Project not found.' };

    const parsed = imagePayloadToRow(imageFields(fd), true);
    if ('error' in parsed) return { error: parsed.error.replace(/`/g, '') };

    const { error } = await supabaseAdmin()
        .from('project_images')
        .update(parsed.row)
        .eq('id', imageId)
        .eq('project_id', id);
    if (error) return { error: error.message };

    refresh();
    return { ok: 'Saved.' };
}

export async function deleteProjectImage(slug: string, imageId: string) {
    await requireAdmin();
    const id = await projectId(slug);
    if (!id) return;
    const { data } = await supabaseAdmin()
        .from('project_images')
        .delete()
        .eq('id', imageId)
        .eq('project_id', id)
        .select('storage_path')
        .maybeSingle();
    await removeObject(data?.storage_path);
    refresh();
}
