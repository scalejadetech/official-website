import 'server-only';
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { BlogSection } from '@/data/blog';
import type { PaperLinks, PaperSection } from '@/data/papers';

// Reads for the admin dashboard: drafts included, nothing redacted.
// Every caller must have passed requireAdmin() first.

export type AdminArticle = {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    date: string;
    readingTime: string;
    coverImage: string | null;
    sections: BlogSection[];
    isPublished: boolean;
    updatedAt: string;
};

export type AdminPaper = {
    slug: string;
    title: string;
    summary: string;
    abstract: string;
    authors: string[];
    date: string;
    topics: string[];
    venue: string | null;
    links: PaperLinks;
    sections: PaperSection[];
    bibtex: string | null;
    isPublished: boolean;
    updatedAt: string;
};

type ArticleRow = {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    published_at: string;
    reading_time: string;
    cover_image: string | null;
    sections: BlogSection[] | null;
    is_published: boolean;
    updated_at: string;
};

type PaperRow = {
    slug: string;
    title: string;
    summary: string;
    abstract: string;
    authors: string[] | null;
    published_at: string;
    topics: string[] | null;
    venue: string | null;
    links: PaperLinks | null;
    sections: PaperSection[] | null;
    bibtex: string | null;
    is_published: boolean;
    updated_at: string;
};

const mapArticle = (r: ArticleRow): AdminArticle => ({
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    category: r.category,
    author: r.author,
    date: r.published_at,
    readingTime: r.reading_time,
    coverImage: r.cover_image,
    sections: r.sections ?? [],
    isPublished: r.is_published,
    updatedAt: r.updated_at,
});

const mapPaper = (r: PaperRow): AdminPaper => ({
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    abstract: r.abstract,
    authors: r.authors ?? [],
    date: r.published_at,
    topics: r.topics ?? [],
    venue: r.venue,
    links: r.links ?? {},
    sections: r.sections ?? [],
    bibtex: r.bibtex,
    isPublished: r.is_published,
    updatedAt: r.updated_at,
});

export async function listArticles(): Promise<AdminArticle[]> {
    const { data, error } = await supabaseAdmin()
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false })
        .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data as ArticleRow[]).map(mapArticle);
}

export async function getArticle(slug: string): Promise<AdminArticle | null> {
    const { data, error } = await supabaseAdmin().from('blog_posts').select('*').eq('slug', slug).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapArticle(data as ArticleRow) : null;
}

export async function listPapers(): Promise<AdminPaper[]> {
    const { data, error } = await supabaseAdmin()
        .from('papers')
        .select('*')
        .order('published_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data as PaperRow[]).map(mapPaper);
}

export async function getPaper(slug: string): Promise<AdminPaper | null> {
    const { data, error } = await supabaseAdmin().from('papers').select('*').eq('slug', slug).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapPaper(data as PaperRow) : null;
}
