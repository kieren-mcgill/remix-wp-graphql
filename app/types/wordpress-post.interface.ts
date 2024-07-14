import YoastHeadJson from "~/types/yoast-head-json.interface";

export default interface WordPressPost {
    id: number;
    title: { rendered: string };
    slug: string,
    link: string,
    acf: object,
    parent: number,
    yoast_head_json: YoastHeadJson
}