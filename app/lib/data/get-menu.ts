import client from '~/lib/graphql-client';
import {WordPressMenu, WordPressMenuResponse} from "~/types/wp-post-types.interface";
import {GET_MENU} from "~/queries/menu-query";
import createGraphQLClient from "~/lib/graphql-client";

const getMenu = async (menuName: string, baseUrl: string): Promise<WordPressMenu> => {

    try {
        const client = createGraphQLClient(baseUrl);
        const response: WordPressMenuResponse = await client.request(GET_MENU, { id: menuName }, baseUrl);

        if (!response.menu) {
            throw new Error(`Menu ${menuName} not found`);
        }

        return response.menu;

    } catch (error) {
        console.error(`Error fetching menu ${menuName}:`, error);
        throw new Error(`Failed to fetch menu: ${error.message}`);
    }
};

export default getMenu;