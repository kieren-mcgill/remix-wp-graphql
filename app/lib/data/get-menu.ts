import client from '~/lib/graphql-client';
import {WordPressMenu, WordPressMenuResponse} from "~/types/wp-post-types.interface";
import {GET_MENU} from "~/queries/menu-query";

const getMenu = async (menuName: string): Promise<WordPressMenu> => {

    try {
        const response: WordPressMenuResponse = await client.request(GET_MENU, { id: menuName });

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