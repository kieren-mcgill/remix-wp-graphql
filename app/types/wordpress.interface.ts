export interface WordPressPage {
    link: string;
    title: string;
    pageContent: {
        pageText: string;
        pageSelect: string;
    };
    seo: {
        breadcrumbs: Array<{
            url: string;
            text: string;
        }>;
        title: string;
        metaDesc: string;
        twitterTitle: string;
        twitterDescription: string;

    };
}

export interface WordPressPost {
    link: string;
    title: string;
    pageContent: {
        pageText: string;
        pageSelect: string;
    };
    seo: {
        breadcrumbs: Array<{
            url: string;
            text: string;
        }>;
    };
}