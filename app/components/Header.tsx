import { NavLink } from "@remix-run/react";
import { flatListToHierarchical } from "~/lib/utils";
import {WordPressMenuItem} from "~/types/wp-post-types.interface";

const renderNavItems = (items, isChild = false) => (
    <ul className={`flex ${isChild ? 'flex-col ml-4' : 'space-x-4'}`}>
        {items && items.length > 0 && items.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            return (
                <li key={item.id}>
                    <NavLink to={item.uri} className="hover:text-blue-500">
                        {item.label}
                    </NavLink>
                    {hasChildren && renderNavItems(item.children, true)}
                </li>
            );
        })}
    </ul>
);


const Header = ({ navMenuItems }: {navMenuItems: Array<WordPressMenuItem>}) => {
    const nestedNavItems = flatListToHierarchical(navMenuItems);

    return (
        <header className="min-h-24 bg-green-400 p-4">
            <nav>
                {renderNavItems(nestedNavItems)}
            </nav>
        </header>
    );
};

export default Header;

