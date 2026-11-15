// Plain-text formats the admin forms use for structured fields, and their
// conversions back and forth.
//
// Article / paper body:
//
//   ## Section heading
//   ![Optional image caption](https://…image url)
//
//   First paragraph.
//
//   Second paragraph.
//
// A line starting "## " starts a new section; a blank line ends a paragraph;
// a line that is only an image tag sets that section's image.

export type TextSection = {
    heading?: string;
    paragraphs: string[];
    image?: string;
    imageCaption?: string;
};

const IMAGE_LINE = /^!\[([^\]]*)\]\((\S+)\)$/;

export function parseSections(text: string): TextSection[] {
    const sections: TextSection[] = [];
    let current: TextSection = { paragraphs: [] };
    let paragraph: string[] = [];

    const endParagraph = () => {
        if (paragraph.length) current.paragraphs.push(paragraph.join('\n'));
        paragraph = [];
    };
    const endSection = () => {
        endParagraph();
        if (current.heading || current.paragraphs.length || current.image) sections.push(current);
    };

    for (const raw of text.replace(/\r\n/g, '\n').split('\n')) {
        const line = raw.trim();
        const image = line.match(IMAGE_LINE);
        if (line.startsWith('## ')) {
            endSection();
            current = { heading: line.slice(3).trim(), paragraphs: [] };
        } else if (image && paragraph.length === 0) {
            current.image = image[2];
            if (image[1].trim()) current.imageCaption = image[1].trim();
        } else if (line === '') {
            endParagraph();
        } else {
            paragraph.push(line);
        }
    }
    endSection();
    return sections;
}

export function serializeSections(sections: TextSection[] | null | undefined): string {
    return (sections ?? [])
        .map((s) =>
            [
                s.heading ? `## ${s.heading}` : null,
                s.image ? `![${s.imageCaption ?? ''}](${s.image})` : null,
                ...s.paragraphs,
            ]
                .filter((x): x is string => x !== null)
                .join('\n\n')
        )
        .join('\n\n');
}

export function estimateReadingTime(sections: TextSection[]): string {
    const words = sections
        .flatMap((s) => [s.heading ?? '', ...s.paragraphs])
        .join(' ')
        .split(/\s+/)
        .filter(Boolean).length;
    return `${Math.max(1, Math.round(words / 200))} min read`;
}

/** One item per line, blanks dropped. */
export const lines = (text: string) =>
    text
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

/** Comma- or line-separated list. */
export const list = (text: string) =>
    text
        .split(/[\n,]/)
        .map((l) => l.trim())
        .filter(Boolean);

/** "value | label" per line. */
export function parseOutcomes(text: string): { value: string; label: string }[] {
    return lines(text).map((l) => {
        const i = l.indexOf('|');
        return i === -1 ? { value: l, label: '' } : { value: l.slice(0, i).trim(), label: l.slice(i + 1).trim() };
    });
}

export const serializeOutcomes = (outcomes: { value: string; label: string }[]) =>
    outcomes.map((o) => `${o.value} | ${o.label}`).join('\n');
