import WordPressPost from "~/types/wordpress-post.interface";
import YoastHeadJson from "~/types/yoast-head-json.interface";

const getYoastMeta = (page: WordPressPost | null) => {

    const metaData: YoastHeadJson | null = page && page.yoast_head_json;

    return [
        { title: metaData?.title || "Site Title" },
        { name: "description", content: metaData?.description || "" },
        { name: "robots", content: metaData?.robots || "index, follow" },
        { rel: "canonical", href: metaData?.canonical || "" },
        { property: "og:title", content: metaData?.og_title || metaData?.title || "Site Title" },
        { property: "og:description", content: metaData?.og_description || metaData?.description || "" },
        { property: "og:image", content: metaData?.og_image || "" },
        { property: "og:url", content: metaData?.canonical || "" },
        { name: "twitter:card", content: metaData?.twitter_card || "summary" },
        { name: "twitter:title", content: metaData?.twitter_title || metaData?.title || "Site Title" },
        { name: "twitter:description", content: metaData?.twitter_description || metaData?.description || "" },
        { name: "twitter:image", content: metaData?.twitter_image || "" },
        { name: "keywords", content: metaData?.keywords || "" }
    ];
}

export default getYoastMeta