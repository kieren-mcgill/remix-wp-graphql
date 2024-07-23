import { MetaFunction, useLoaderData } from "@remix-run/react";
import createMeta from "~/lib/create-meta";
import { WordPressPage } from "~/types/wordpress.interface";
import fetchPage from "~/lib/data/fetch-page";
import { Params } from "~/types/remix.interface";

export const loader = async ({ params }: { params: Params }) => {
    try {
        return await fetchPage<WordPressPage | null>({ params });
    } catch (error) {
        console.error('Error in loader:', error);
        throw error;
    }
};

export const meta: MetaFunction = ({ data }) => {
    if (!data) {
        return [];
    }
    return createMeta(data.seo);
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
