/**
 * Converts text into a URL-safe slug.
 * Example: "Kochi City Center" → "kochi-city-center"
 */
export default function createSlug(input: string): string {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')   // remove special chars
        .replace(/\s+/g, '-')       // spaces → hyphens
        .replace(/-+/g, '-')        // collapse multiple hyphens
}
