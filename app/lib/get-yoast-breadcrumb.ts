import WordPressPost from "~/types/wordpress-post.interface";
import BreadcrumbItem from "~/types/breadcrumb-item.interface";

const getYoastBreadcrumb = (data: WordPressPost | null) => {

    if (!data) {
        console.error("Could not find yoast breadcrumb data")
        return null;
    }

    const yoastBreadcrumbArray = data.yoast_head_json.schema['@graph'];
    const yoastBreadcrumbObject = yoastBreadcrumbArray.find((item) => item['@type'] === 'BreadcrumbList');

    if (yoastBreadcrumbObject) {
        return yoastBreadcrumbObject.itemListElement as BreadcrumbItem[];

    } else {
        console.error("Could not find yoast breadcrumb data")
        return null;
    }
}

export default getYoastBreadcrumb;
