export default interface YoastHeadJson {
    schema: {
        '@graph': Array<{ [key: string]: never }>;
    };
    title: string;
    description?: string;
    robots?: string;
    canonical?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    twitter_card?: string;
    twitter_title?: string;
    twitter_description?: string;
    twitter_image?: string;
    keywords?: string
}