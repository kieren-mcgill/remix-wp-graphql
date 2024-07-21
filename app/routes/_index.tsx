import {Params} from "~/types/remix.interface";
import fetchPage from "~/lib/data/fetch-page";
import process from "process";
import WordPressPageTemplate, { meta } from "~/components/WordPressPageTemplate";

export async function loader({ params }: { params: Params }) {

    const homePageSlug = process.env.HOMEPAGE_SLUG

    try {
        return await fetchPage({ params: { ...params, slug: homePageSlug }});
    } catch (error) {
        console.error('Error in loader:', error);
        throw error;
    }
}

export const handle = {};

export { meta }

const HomePage = () => <WordPressPageTemplate />;

export default HomePage;

