import getYoastBreadcrumb from "~/lib/get-yoast-breadcrumb";
import WordPressPost from "~/types/wordpress-post.interface";

export default interface PageLoaderResult {
    page: WordPressPost | null;
    isCorrectPath: boolean;
    breadcrumbs: ReturnType<typeof getYoastBreadcrumb>;
}