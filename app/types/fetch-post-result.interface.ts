import WordPressPost from "~/types/wordpress-post.interface";
import getYoastBreadcrumb from "~/lib/get-yoast-breadcrumb";

export default interface FetchPostResult {
    post: WordPressPost | null;
    breadcrumbs: ReturnType<typeof getYoastBreadcrumb>;
};