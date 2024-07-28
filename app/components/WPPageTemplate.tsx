import {MetaFunction, useLoaderData, useRouteError} from "@remix-run/react";
import createMeta from "~/lib/create-meta";
import { WordPressPage } from "~/types/wp-post-types.interface";
import getPage from "~/lib/data/get-page";
import { Params } from "~/types/params.interface";
import process from "process";
import React from "react";

export const loader = async ({ params }: { params: Params }) => {
    const homePageSlug = process.env.HOMEPAGE_SLUG;
    const baseUrl = process.env.WORDPRESS_API_URL;

    try {
        const page = await getPage<WordPressPage | null>({ params, homePageSlug, baseUrl });

        if (!page) {
            throw new Response('Page not found', { status: 404 });
        }

        return (page);
    } catch (error) {
        console.error('Error in page loader:', error);
        throw error;
    }
};

export function ErrorBoundary() {
    const error = useRouteError();
    console.error(error);
    return (
        <h1>{error.status}</h1>
    );
}

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
