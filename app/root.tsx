import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration, useLoaderData,
} from "@remix-run/react";
import "./styles/tailwind.css";
import React from "react";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Breadcrumb from "~/components/Breadcrumb";
import getMenu from "~/lib/data/get-menu";
import {WordPressMenu} from "~/types/wp-post-types.interface";
import process from "process";

export const loader = async () => {
    const navMenuName: string = process.env.NAV_MENU_NAME;
    const footerSitemapName: string = process.env.SITEMAP_NAME;

    try {
        const navMenu = await getMenu<WordPressMenu | null>(navMenuName);
        const sitemap = await getMenu<WordPressMenu | null>(footerSitemapName);

        return {navMenuItems: navMenu.menuItems.nodes,
                sitemapItems: sitemap.menuItems.nodes
                }
    } catch (error) {
        console.error('Error in root loader:', error);
        throw new Response('Failed to load root data', { status: 500 });
    }
};

export function Layout({ children }: { children: React.ReactNode }) {

  const {navMenuItems, sitemapItems} = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={"flex flex-col min-h-screen"}>

      <Header navMenuItems={navMenuItems}/>
      <Breadcrumb/>

      <main className={"flex-grow"}>

      {children}

      </main>

      <Footer sitemapItems={sitemapItems}/>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
