import {MetaFunction, useLoaderData} from "@remix-run/react";
import {Params} from "~/types/remix.interface";
import getYoastMeta from "~/lib/get-yoast-meta";
import {WordPressPage} from "~/types/wordpress.interface";
import fetchPage from "~/lib/data/fetch-page";
import process from "process";

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

export const meta: MetaFunction = ({data}) => {
    if (!data) {
        return [];
    }
    return getYoastMeta(data.page);
};

const Page = () => {
    const page = useLoaderData<WordPressPage>();

    return (
        <div>
            <h1>{page.title}</h1>
        </div>
    );
}

export default Page;

