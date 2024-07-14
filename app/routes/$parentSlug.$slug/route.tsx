import {MetaFunction, useLoaderData} from "@remix-run/react";
import Params from "~/types/params.interface";
import pageLoader from "~/lib/page-loader";
import WordPressPost from "~/types/wordpress-post.interface";
import getYoastMeta from "~/lib/get-yoast-meta";

export async function loader({params}: { params: Params }) {

    const {parentSlug, slug} = params;

    const {page, isCorrectPath, breadcrumbs} = await pageLoader({parentSlug, slug})

    if (!page || !isCorrectPath) {
        throw new Response('Page not found', {status: 404});
    }

    return {page, breadcrumbs};
}

export const handle = {

};

export const meta: MetaFunction = ({data}) => {
    if (!data) {
        return [];
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return getYoastMeta(data.page);
};

const Page = () => {
    const {page}: { page: WordPressPost } = useLoaderData();

    return (
        <div>
            <h1>{page.title.rendered}</h1>
        </div>
    );
}

export default Page;