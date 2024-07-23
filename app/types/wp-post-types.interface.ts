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

export interface WordPressMenuItem {
    id: string;
    label: string;
    uri: string;
    parentId: string;
}

export interface WordPressMenu {
    id: string;
    name: string;
    menuItems: {
        nodes: WordPressMenuItem[];
    };
}

export interface WordPressMenuResponse {
    menu: WordPressMenu;
}