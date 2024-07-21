import { MetaFunction, useLoaderData } from "@remix-run/react";
import getYoastMeta from "~/lib/get-yoast-meta";
import { WordPressPage } from "~/types/wordpress.interface";
import fetchPage from "~/lib/data/fetch-page";
import { Params } from "~/types/remix.interface";

export const loader = async ({ params }: { params: Params }) => {
    try {
        return await fetchPage({ params });
    } catch (error) {
        console.error('Error in loader:', error);
        throw error;
    }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    if (!data) {
        return [];
    }
    return getYoastMeta(data.page);
};

const WordPressPageTemplate = () => {
    const page = useLoaderData<WordPressPage>();

    return (
        <div>
            <h1>{page.title}</h1>
        </div>
    );
};

export default WordPressPageTemplate;
