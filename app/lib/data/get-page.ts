import { GET_PAGE } from '~/queries/page-query';
import { WordPressPage } from "~/types/wp-post-types.interface";
import createGraphQLClient from "~/lib/graphql-client";

const getPage = async ({ params, homePageSlug, baseUrl }) : Promise<WordPressPage> => {
    const { grandParentSlug, parentSlug, slug } = params;

    try {
        const client = createGraphQLClient(baseUrl)
        const data = await client.request(GET_PAGE, { id: slug });
        const page = data.page;

        if (!page) {
            console.error('Page not found');
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
        }

        return page;
    } catch (error) {
        console.error('Error fetching page:', error);
    }
};

export default getPage;

