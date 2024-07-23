import {Params} from "~/types/params.interface";
import getPage from "~/lib/data/get-page";
import process from "process";
import WPPageTemplate, { meta } from "~/components/WPPageTemplate";

export async function loader({ params }: { params: Params }) {

    const homePageSlug = process.env.HOMEPAGE_SLUG

    try {
        return await getPage({ params: { ...params, slug: homePageSlug }});
    } catch (error) {
        console.error('Error in loader:', error);
        throw error;
    }
}

export const handle = {};

export { meta }

const HomePage = () => <WPPageTemplate />;

export default HomePage;

