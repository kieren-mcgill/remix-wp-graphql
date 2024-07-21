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

export interface BreadcrumbItem {
    name: string;
    item: string;
}