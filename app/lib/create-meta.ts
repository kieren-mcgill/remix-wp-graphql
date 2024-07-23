import SeoData from "~/types/seo.interface";

const createMeta = (seoData: SeoData | null) => {

    return [
        { title: seoData?.title || "Site Title" },
        { name: "description", content: seoData?.description || "" },
        { name: "twitter:title", content: seoData?.twitter_title || seoData?.title || "Site Title" },
        { name: "twitter:description", content: seoData?.twitter_description || seoData?.description || "" },

    ];
}

export default createMeta;