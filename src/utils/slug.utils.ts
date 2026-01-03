/**
 * Creates a URL-friendly slug from a string.
 * @param text The text to slugify (e.g., "Kakkanad Kochi")
 * @param options Configuration options
 * @returns A slugified string (e.g., "kakkanad-kochi")
 */
export const createSlug = (
    text: string,
    options: {
        lower?: boolean;
        separator?: string;
        strict?: boolean;
    } = {}
): string => {
    const { lower = true, separator = '-', strict = false } = options;

    let slug = text;

    // Convert to lowercase if needed
    if (lower) {
        slug = slug.toLowerCase();
    }

    // Replace spaces and underscores with separator
    slug = slug.replace(/[\s_]+/g, separator);

    // Remove accents/diacritics
    slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (strict) {
        // Strict mode: only allow alphanumeric and separator
        slug = slug.replace(new RegExp(`[^a-zA-Z0-9${separator}]`, 'g'), '');
    } else {
        // Remove special characters except alphanumeric, separator, and basic punctuation
        slug = slug.replace(new RegExp(`[^a-zA-Z0-9${separator}.-]`, 'g'), '');
    }

    // Remove multiple consecutive separators
    slug = slug.replace(new RegExp(`${separator}+`, 'g'), separator);

    // Trim separators from start and end
    slug = slug.replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '');

    return slug;
};