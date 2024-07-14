import getYoastBreadcrumb from "~/lib/get-yoast-breadcrumb";
import FetchPageResult from '../../types/fetch-page-result.interface'
import WordPressPost from "~/types/wordpress-post.interface";

const baseUrl = process.env.WORDPRESS_API_URL;

export async function fetchPage(slug: string): Promise<FetchPageResult> {
    const response = await fetch(`${baseUrl}/wp-json/wp/v2/pages?slug=${slug}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch page with slug: ${slug}`);
    }
    const pages: WordPressPost[] = await response.json();

    const page: WordPressPost | null = pages.length > 0 ? pages[0] : null;

    const breadcrumbs = getYoastBreadcrumb(page);

    return {page, breadcrumbs}
}