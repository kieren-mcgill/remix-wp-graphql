import {Params} from "~/types/params.interface";
import getPage from "~/lib/data/get-page";
import process from "process";
import WPPageTemplate, { meta } from "~/components/WPPageTemplate";

export async function loader({ params }: { params: Params }) {

    const homePageSlug = process.env.HOMEPAGE_SLUG;
    const baseUrl = process.env.WORDPRESS_API_URL;

    try {
        return await getPage({ params: { ...params, slug: homePageSlug }, homePageSlug, baseUrl});


    } catch (error) {
        console.error('Error in home page loader:', error);
        throw error;
    }
}

export const handle = {};

export { meta }

const HomePage = () => <WPPageTemplate />;

export default HomePage;

