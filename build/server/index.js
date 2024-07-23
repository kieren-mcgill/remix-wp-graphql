import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer, NavLink, useMatches, Meta, Links, Scripts, Outlet, useLoaderData, ScrollRestoration, useRouteError } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { GraphQLClient } from "graphql-request";
import process$1 from "process";
import * as process from "node:process";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const flatListToHierarchical = (data = [], { idKey = "id", parentKey = "parentId", childrenKey = "children" } = {}) => {
  const tree = [];
  const childrenOf = {};
  data.forEach((item) => {
    const newItem = { ...item };
    const { [idKey]: id, [parentKey]: parentId = null } = newItem;
    childrenOf[id] = childrenOf[id] || [];
    newItem[childrenKey] = childrenOf[id];
    if (parentId !== null) {
      childrenOf[parentId] = childrenOf[parentId] || [];
      childrenOf[parentId].push(newItem);
    } else {
      tree.push(newItem);
    }
  });
  return tree;
};
const renderNavItems = (items, isChild = false) => /* @__PURE__ */ jsx("ul", { className: `flex ${isChild ? "flex-col ml-4" : "space-x-4"}`, children: items && items.length > 0 && items.map((item) => {
  const hasChildren = item.children && item.children.length > 0;
  return /* @__PURE__ */ jsxs("li", { children: [
    /* @__PURE__ */ jsx(NavLink, { to: item.uri, className: "hover:text-blue-500", children: item.label }),
    hasChildren && renderNavItems(item.children, true)
  ] }, item.id);
}) });
const Header = ({ navMenuItems }) => {
  const nestedNavItems = flatListToHierarchical(navMenuItems);
  return /* @__PURE__ */ jsx("header", { className: "min-h-24 bg-green-400 p-4", children: /* @__PURE__ */ jsx("nav", { children: renderNavItems(nestedNavItems) }) });
};
const Sitemap = ({ items }) => {
  return /* @__PURE__ */ jsxs("nav", { children: [
    /* @__PURE__ */ jsx("ul", { className: "flex gap-3", children: items.map(
      (item, index) => {
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(NavLink, { to: item.uri, children: item.label }) }, index);
      }
    ) }),
    /* @__PURE__ */ jsx("h2", { children: "Sitemap" })
  ] });
};
const Footer = ({ sitemapItems }) => {
  return /* @__PURE__ */ jsxs("footer", { className: "min-h-24 bg-blue-400", children: [
    /* @__PURE__ */ jsx("h2", { children: "Footer" }),
    /* @__PURE__ */ jsx(Sitemap, { items: sitemapItems })
  ] });
};
const BreadcrumbLink = ({ path, name, isLastItem }) => {
  return isLastItem ? /* @__PURE__ */ jsx("p", { children: name }) : /* @__PURE__ */ jsx(NavLink, { to: path, children: name });
};
const Breadcrumb = () => {
  var _a;
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  const breadcrumbs = (_a = lastMatch.data) == null ? void 0 : _a.seo.breadcrumbs;
  const showBreadcrumb = breadcrumbs ? breadcrumbs.length > 1 : false;
  return /* @__PURE__ */ jsx(Fragment, { children: breadcrumbs && showBreadcrumb && /* @__PURE__ */ jsx("nav", { className: "h-8 bg-amber-400", "aria-label": "breadcrumb", children: /* @__PURE__ */ jsx("ul", { className: "flex gap-3", children: breadcrumbs.map(
    (breadcrumb, index) => {
      const itemURLObj = breadcrumb.url && new URL(breadcrumb.url);
      const relPath = itemURLObj ? itemURLObj.pathname : "#";
      return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        BreadcrumbLink,
        {
          path: relPath,
          name: breadcrumb.text,
          isLastItem: index === breadcrumbs.length - 1
        }
      ) }, index);
    }
  ) }) }) });
};
const GET_MENU = `
  query GetMenu($id: ID!) {
    menu(id: $id, idType: NAME) {
      id
      name
      menuItems {
        nodes {
          id
          label
          uri
          parentId
        }
      }
    }
  }
`;
const createGraphQLClient = (baseURL) => {
  const endpoint = `${baseURL}/graphql`;
  return new GraphQLClient(endpoint);
};
const getMenu = async (menuName, baseUrl) => {
  try {
    const client2 = createGraphQLClient(baseUrl);
    const response = await client2.request(GET_MENU, { id: menuName }, baseUrl);
    if (!response.menu) {
      throw new Error(`Menu ${menuName} not found`);
    }
    return response.menu;
  } catch (error) {
    console.error(`Error fetching menu ${menuName}:`, error);
    throw new Error(`Failed to fetch menu: ${error.message}`);
  }
};
const ErrorBoundaryComponent = ({ error }) => {
  return /* @__PURE__ */ jsxs("html", { children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("title", { children: "Oh no!" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx("h1", { children: error.status }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
};
const loader$3 = async () => {
  const navMenuName = process$1.env.NAV_MENU_NAME;
  const footerSitemapName = process$1.env.SITEMAP_NAME;
  const baseUrl = process$1.env.WORDPRESS_API_URL;
  try {
    const navMenu = await getMenu(navMenuName, baseUrl);
    const sitemap = await getMenu(footerSitemapName, baseUrl);
    return {
      navMenuItems: navMenu.menuItems.nodes,
      sitemapItems: sitemap.menuItems.nodes
    };
  } catch (error) {
    console.error("Error in root loader:", error);
    throw new Response("Failed to load root data", { status: 500 });
  }
};
function Layout({ children }) {
  const data = useLoaderData();
  const { navMenuItems = [], sitemapItems = [] } = data || {};
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "flex flex-col min-h-screen", children: [
      /* @__PURE__ */ jsx(Header, { navMenuItems }),
      /* @__PURE__ */ jsx(Breadcrumb, {}),
      /* @__PURE__ */ jsx("main", { className: "flex-grow", children }),
      /* @__PURE__ */ jsx(Footer, { sitemapItems }),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
function ErrorBoundary$1() {
  const error = useRouteError();
  console.error(error);
  return /* @__PURE__ */ jsx(ErrorBoundaryComponent, { error });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$1,
  Layout,
  default: App,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const createMeta = (seoData) => {
  return [
    { title: (seoData == null ? void 0 : seoData.title) || "Site Title" },
    { name: "description", content: (seoData == null ? void 0 : seoData.description) || "" },
    { name: "twitter:title", content: (seoData == null ? void 0 : seoData.twitter_title) || (seoData == null ? void 0 : seoData.title) || "Site Title" },
    { name: "twitter:description", content: (seoData == null ? void 0 : seoData.twitter_description) || (seoData == null ? void 0 : seoData.description) || "" }
  ];
};
const SEO_FRAGMENT = `
  fragment SeoFragment on PostTypeSEO {
    breadcrumbs {
      url
      text
    }
    title
    metaDesc
    twitterTitle
    twitterDescription
  }
`;
const GET_PAGE = `
  query GetPage($id: ID!) {
    page(id: $id, idType: URI) {
      title
      link
      seo {
        ...SeoFragment
      }
    }
  }
  ${SEO_FRAGMENT}
`;
const getPage = async ({ params, homePageSlug, baseUrl }) => {
  const { grandParentSlug, parentSlug, slug } = params;
  try {
    const client = createGraphQLClient(baseUrl);
    const data = await client.request(GET_PAGE, { id: slug });
    const page = data.page;
    if (!page) {
      console.error("Page not found");
      throw new Response("Page not found", { status: 404 });
    }
    const pageRelPath = new URL(page.link).pathname;
    let isCorrectPath;
    if (grandParentSlug && parentSlug) {
      isCorrectPath = pageRelPath === `/${grandParentSlug}/${parentSlug}/${slug}/`;
    } else if (parentSlug) {
      isCorrectPath = pageRelPath === `/${parentSlug}/${slug}/`;
    } else if (slug === homePageSlug) {
      isCorrectPath = true;
    } else {
      isCorrectPath = pageRelPath === `/${slug}/`;
    }
    if (!isCorrectPath) {
      console.error("Found page does not match the expected path:");
      throw new Response("Found page does not match path", { status: 404 });
    }
    return page;
  } catch (error) {
    console.error("Error fetching page:", error);
  }
};
const loader$2 = async ({ params }) => {
  const homePageSlug = process$1.env.HOMEPAGE_SLUG;
  const baseUrl = process$1.env.WORDPRESS_API_URL;
  try {
    const page = await getPage({ params, homePageSlug, baseUrl });
    if (!page) {
      throw new Response("Page not found", { status: 404 });
    }
    return page;
  } catch (error) {
    console.error("Error in page loader:", error);
    throw error;
  }
};
function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return /* @__PURE__ */ jsx("h1", { children: error.status });
}
const meta = ({ data }) => {
  if (!data) {
    return [];
  }
  return createMeta(data.seo);
};
const WPPageTemplate = () => {
  const page = useLoaderData();
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: page.title }) });
};
const GrandParentSlugParentSlugSlugPage = () => /* @__PURE__ */ jsx(WPPageTemplate, {});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: GrandParentSlugParentSlugSlugPage,
  loader: loader$2,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const ParentSlugSlugPage = () => /* @__PURE__ */ jsx(WPPageTemplate, {});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: ParentSlugSlugPage,
  loader: loader$2,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const loader$1 = () => {
  const baseUrl = process.env.WORDPRESS_API_URL;
  const robotText = `
        User-agent: Googlebot
        Disallow: /nogooglebot/
        User-agent: *
        Allow: /
        Sitemap: ${baseUrl}/sitemap_index.xml`;
  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain"
    }
  });
};
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
async function loader({ params }) {
  const homePageSlug = process$1.env.HOMEPAGE_SLUG;
  const baseUrl = process$1.env.WORDPRESS_API_URL;
  try {
    return await getPage({ params: { ...params, slug: homePageSlug }, homePageSlug, baseUrl });
  } catch (error) {
    console.error("Error in loader:", error);
    throw error;
  }
}
const handle = {};
const HomePage = () => /* @__PURE__ */ jsx(WPPageTemplate, {});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: HomePage,
  handle,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const SlugPage = () => /* @__PURE__ */ jsx(WPPageTemplate, {});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: SlugPage,
  loader: loader$2,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DM7VrvJJ.js", "imports": ["/assets/components--ykycIIQ.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-DYFN8XQH.js", "imports": ["/assets/components--ykycIIQ.js"], "css": ["/assets/root-BBfxKysy.css"] }, "routes/$grandParentSlug.$parentSlug.$slug": { "id": "routes/$grandParentSlug.$parentSlug.$slug", "parentId": "root", "path": ":grandParentSlug/:parentSlug/:slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/route-CY0dPgXT.js", "imports": ["/assets/components--ykycIIQ.js", "/assets/WPPageTemplate-BrBcyhdi.js"], "css": [] }, "routes/$parentSlug.$slug": { "id": "routes/$parentSlug.$slug", "parentId": "root", "path": ":parentSlug/:slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/route-DT17a443.js", "imports": ["/assets/components--ykycIIQ.js", "/assets/WPPageTemplate-BrBcyhdi.js"], "css": [] }, "routes/[robots.txt]": { "id": "routes/[robots.txt]", "parentId": "root", "path": "robots.txt", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_robots.txt_-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/post.$slug": { "id": "routes/post.$slug", "parentId": "root", "path": "post/:slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-B3nhAzTk.js", "imports": ["/assets/components--ykycIIQ.js", "/assets/WPPageTemplate-BrBcyhdi.js"], "css": [] }, "routes/$slug": { "id": "routes/$slug", "parentId": "root", "path": ":slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/route-DIUzV8Kp.js", "imports": ["/assets/components--ykycIIQ.js", "/assets/WPPageTemplate-BrBcyhdi.js"], "css": [] } }, "url": "/assets/manifest-957cdc7c.js", "version": "957cdc7c" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "unstable_singleFetch": false, "unstable_fogOfWar": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/$grandParentSlug.$parentSlug.$slug": {
    id: "routes/$grandParentSlug.$parentSlug.$slug",
    parentId: "root",
    path: ":grandParentSlug/:parentSlug/:slug",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/$parentSlug.$slug": {
    id: "routes/$parentSlug.$slug",
    parentId: "root",
    path: ":parentSlug/:slug",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/[robots.txt]": {
    id: "routes/[robots.txt]",
    parentId: "root",
    path: "robots.txt",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/post.$slug": {
    id: "routes/post.$slug",
    parentId: "root",
    path: "post/:slug",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route5
  },
  "routes/$slug": {
    id: "routes/$slug",
    parentId: "root",
    path: ":slug",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
