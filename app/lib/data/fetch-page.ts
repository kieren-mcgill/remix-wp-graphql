import client from '~/lib/graphql-client';
import { GET_PAGE } from '~/queries/page';
import { WordPressPage } from "~/types/wordpress.interface";
import process from "process";

const fetchPage = async ({ params }): Promise<WordPressPage> => {
    const { grandParentSlug, parentSlug, slug } = params;
    const homePageSlug = process.env.HOMEPAGE_SLUG;

    try {
        const data = await client.request(GET_PAGE, { id: slug });
        const page = data.page;

        if (!page) {
            console.error('Page not found');
            throw new Response('Not Found', { status: 404 });
        }

        const pageRelPath = new URL(page.link).pathname;
        let isCorrectPath;

        if (grandParentSlug && parentSlug) {
            isCorrectPath = pageRelPath === `/${grandParentSlug}/${parentSlug}/${slug}/`;
        } else if (parentSlug) {
            isCorrectPath = pageRelPath === `/${parentSlug}/${slug}/`;
        } else if (slug === homePageSlug) {
            isCorrectPath = true;
        } else {
            isCorrectPath = pageRelPath === `/${slug}/`;
        }

        if (!isCorrectPath) {
            console.error('Found page does not match the expected path:');
            throw new Response('Found page does not match path', { status: 404 });
        }

        return page;
    } catch (error) {
        console.error('Error fetching page:', error);
        throw new Response('Failed to load data', { status: 500 });
    }
};

export default fetchPage;

