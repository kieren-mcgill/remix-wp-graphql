import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration, useLoaderData, useRouteError,
} from "@remix-run/react";
import "./styles/tailwind.css";
import React from "react";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Breadcrumb from "~/components/Breadcrumb";
import ErrorBoundary from "~/components/ErrorBoundary";
import getMenu from "~/lib/data/get-menu";
import {WordPressMenu} from "~/types/wp-post-types.interface";
import process from "process";
import ErrorBoundaryComponent from "~/components/ErrorBoundary";

export const loader = async () => {
    const navMenuName: string = process.env.NAV_MENU_NAME;
    const footerSitemapName: string = process.env.SITEMAP_NAME;
    const baseUrl: string = process.env.WORDPRESS_API_URL;

    try {
        const navMenu = await getMenu<WordPressMenu | null>(navMenuName, baseUrl);
        const sitemap = await getMenu<WordPressMenu | null>(footerSitemapName, baseUrl);

        return {navMenuItems: navMenu.menuItems.nodes,
                sitemapItems: sitemap.menuItems.nodes
                }
    } catch (error) {
        console.error('Error in root loader:', error);
        throw new Response('Failed to load root data', { status: 500 });
    }
};

export function Layout({ children }: { children: React.ReactNode }) {

    const data = useLoaderData();

    const { navMenuItems = [], sitemapItems = [] } = data || {};

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

export function ErrorBoundary() {
    const error = useRouteError();
    console.error(error);
    return (
        <ErrorBoundaryComponent error={error}/>
    );
}






