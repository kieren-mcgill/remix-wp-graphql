import getYoastBreadcrumb from "~/lib/get-yoast-breadcrumb";
import WordPressPost from "~/types/wordpress-post.interface";

export default interface FetchPageResult {
    page: WordPressPost | null;
    breadcrumbs: ReturnType<typeof getYoastBreadcrumb>;
};