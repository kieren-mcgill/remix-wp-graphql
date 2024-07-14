import WordPressPost from "~/types/wordpress-post.interface";
import getYoastBreadcrumb from "~/lib/get-yoast-breadcrumb";

export default interface LoaderData {
    page: WordPressPost;
    breadcrumbs: ReturnType<typeof getYoastBreadcrumb>;
}