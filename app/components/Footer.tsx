import Sitemap from "~/components/Sitemap";
import {WordPressMenuItem} from "~/types/wp-post-types.interface";

const Footer = ({sitemapItems}:{sitemapItems: Array<WordPressMenuItem>}) => {

    return (
        <footer className={"min-h-24 bg-blue-400"}>
            <h2>Footer</h2>
            <Sitemap items={sitemapItems}/>
        </footer>

    )
}

export default Footer