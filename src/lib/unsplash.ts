const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const API_URL = 'https://api.unsplash.com';

export interface UnsplashImage {
    id: string;
    urls: {
        regular: string;
        small: string;
    };
    alt_description: string;
    description: string | null;
}

export async function searchWeddingImages(query: string, perPage = 10, excludeUrls: string[] = []): Promise<UnsplashImage[]> {
    if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY.includes('placeholder')) {
        console.warn('Unsplash API Key is missing');
        return [];
    }

    // Unsplash API doesn't support exclusion by URL natively in search, so we must fetch more and filter.
    // Fetching 3x the required amount to ensure we have enough after filtering.
    const fetchCount = Math.min(30, perPage * 3);

    const response = await fetch(`${API_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=${fetchCount}&orientation=portrait`, {
        headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch images from Unsplash');
    }

    const data = await response.json();
    const results: UnsplashImage[] = data.results;

    // Filter out excluded URLs
    const filtered = results.filter(img => !excludeUrls.includes(img.urls.regular));

    return filtered.slice(0, perPage);
}

export async function getWeddingImages() {
    const queries = ['wedding dress', 'wedding decor', 'wedding rings', 'wedding venue'];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    return searchWeddingImages(randomQuery, 20);
}
