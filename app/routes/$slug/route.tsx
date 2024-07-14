import {useLoaderData, MetaFunction} from "@remix-run/react";
import Params from "~/types/params.interface";
import pageLoader from "~/lib/page-loader";
import getYoastMeta from "~/lib/get-yoast-meta";
import LoaderData from "~/types/loader-data.interface";
import WordPressPost from "~/types/wordpress-post.interface";

export async function loader({params}: { params: Params }) {

    const {slug} = params;
    const {page, isCorrectPath, breadcrumbs} = await pageLoader({slug})

    if (!page || !isCorrectPath) {
        throw new Response('Page not found', {status: 404});
    }

    return {page, breadcrumbs} as LoaderData;
}

export const handle = {};

export const meta: MetaFunction = ({data}) => {
    if (!data) {
        return [];
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return getYoastMeta(data.page);
};

const Page = () => {
    const {page}: { page: WordPressPost } = useLoaderData<LoaderData>();

    return (
        <div>
            <h1>{page.title.rendered}</h1>
        </div>
    );
}

export default Page;