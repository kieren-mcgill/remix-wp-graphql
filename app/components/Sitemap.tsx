import {WordPressMenuItem} from "~/types/wp-post-types.interface";
import {NavLink} from "@remix-run/react";

const Sitemap = ({items}:{items: Array<WordPressMenuItem>}) => {

    return (
        <nav>
            <ul className={"flex gap-3"}>
                {
                    items.map((item, index) => {
                        return (
                            <li key={index}>
                                <NavLink to={item.uri}>{item.label}</NavLink>
                            </li>
                        )}
                    )
                }

            </ul>
            <h2>Sitemap</h2>

        </nav>
    )
}

export default Sitemap