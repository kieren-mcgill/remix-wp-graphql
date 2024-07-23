import { MetaFunction, useLoaderData } from "@remix-run/react";
import createMeta from "~/lib/create-meta";
import { WordPressPage } from "~/types/wp-post-types.interface";
import getPage from "~/lib/data/get-page";
import { Params } from "~/types/params.interface";
import process from "process";

export const loader = async ({ params }: { params: Params }) => {
    const homePageSlug = process.env.HOMEPAGE_SLUG;
    const baseUrl = process.env.WORDPRESS_API_URL;
    try {
        return await getPage<WordPressPage | null>({ params, homePageSlug, baseUrl });
    } catch (error) {
        console.error('Error in page loader:', error);
        throw new Response('Failed to load page data', { status: 500 });
    }
};

export const meta: MetaFunction = ({ data }) => {
    if (!data) {
        return [];
    }
    return createMeta(data.seo);
};

const WPPageTemplate = () => {
    const page = useLoaderData<WordPressPage>();

    return (
        <div>
            <h1>{page.title}</h1>
        </div>
    );
};

export default WPPageTemplate;
