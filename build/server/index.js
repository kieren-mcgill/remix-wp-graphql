import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer, NavLink, useMatches, Outlet, Meta, Links, ScrollRestoration, Scripts, useLoaderData } from "@remix-run/react";
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
const Header = () => {
  return /* @__PURE__ */ jsx("div", { className: "min-h-24 bg-green-400", children: /* @__PURE__ */ jsx("h1", { children: "Header" }) });
};
const Sitemap = () => {
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", { children: "Sitemap" }) });
};
const Footer = () => {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-24 bg-blue-400", children: [
    /* @__PURE__ */ jsx("h2", { children: "Footer" }),
    /* @__PURE__ */ jsx(Sitemap, {})
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
  return /* @__PURE__ */ jsx(Fragment, { children: breadcrumbs && showBreadcrumb && /* @__PURE__ */ jsx("nav", { className: "h-8 bg-amber-400", "aria-label": "breadcrumb", children: /* @__PURE__ */ jsx("ol", { className: "flex gap-3", children: breadcrumbs.map(
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
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "flex flex-col min-h-screen", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx(Breadcrumb, {}),
      /* @__PURE__ */ jsx("main", { className: "flex-grow", children }),
      /* @__PURE__ */ jsx(Footer, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App
}, Symbol.toStringTag, { value: "Module" }));
const createMeta = (seoData) => {
  return [
    { title: (seoData == null ? void 0 : seoData.title) || "Site Title" },
    { name: "description", content: (seoData == null ? void 0 : seoData.description) || "" },
    { name: "twitter:title", content: (seoData == null ? void 0 : seoData.twitter_title) || (seoData == null ? void 0 : seoData.title) || "Site Title" },
    { name: "twitter:description", content: (seoData == null ? void 0 : seoData.twitter_description) || (seoData == null ? void 0 : seoData.description) || "" }
  ];
};
const baseURL = process$1.env.WORDPRESS_API_URL;
const endpoint = `${baseURL}/graphql`;
const client = new GraphQLClient(endpoint, {});
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
const fetchPage = async ({ params }) => {
  const { grandParentSlug, parentSlug, slug } = params;
  const homePageSlug = process$1.env.HOMEPAGE_SLUG;
  try {
    const data = await client.request(GET_PAGE, { id: slug });
    const page = data.page;
    if (!page) {
      console.error("Page not found");
      throw new Response("Not Found", { status: 404 });
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
    throw new Response("Failed to load data", { status: 500 });
  }
};
const loader$2 = async ({ params }) => {
  try {
    return await fetchPage({ params });
  } catch (error) {
    console.error("Error in loader:", error);
    throw error;
  }
};
const meta = ({ data }) => {
  if (!data) {
    return [];
  }
  return createMeta(data.seo);
};
const WordPressPageTemplate = () => {
  const page = useLoaderData();
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: page.title }) });
};
const GrandParentSlugParentSlugSlugPage = () => /* @__PURE__ */ jsx(WordPressPageTemplate, {});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: GrandParentSlugParentSlugSlugPage,
  loader: loader$2,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const ParentSlugSlugPage = () => /* @__PURE__ */ jsx(WordPressPageTemplate, {});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
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
  try {
    return await fetchPage({ params: { ...params, slug: homePageSlug } });
  } catch (error) {
    console.error("Error in loader:", error);
    throw error;
  }
}
const handle = {};
const HomePage = () => /* @__PURE__ */ jsx(WordPressPageTemplate, {});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: HomePage,
  handle,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const SlugPage = () => /* @__PURE__ */ jsx(WordPressPageTemplate, {});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SlugPage,
  loader: loader$2,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-43Y8tM5Z.js", "imports": ["/assets/components-C_kpxqgJ.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-CzfkUbjf.js", "imports": ["/assets/components-C_kpxqgJ.js"], "css": ["/assets/root-CeYH0zgx.css"] }, "routes/$grandParentSlug.$parentSlug.$slug": { "id": "routes/$grandParentSlug.$parentSlug.$slug", "parentId": "root", "path": ":grandParentSlug/:parentSlug/:slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-syS7MhZf.js", "imports": ["/assets/components-C_kpxqgJ.js", "/assets/WPPageTemplate-Bo9fKNpD.js"], "css": [] }, "routes/$parentSlug.$slug": { "id": "routes/$parentSlug.$slug", "parentId": "root", "path": ":parentSlug/:slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-CB6xPDiB.js", "imports": ["/assets/components-C_kpxqgJ.js", "/assets/WPPageTemplate-Bo9fKNpD.js"], "css": [] }, "routes/[robots.txt]": { "id": "routes/[robots.txt]", "parentId": "root", "path": "robots.txt", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_robots.txt_-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/post.$slug": { "id": "routes/post.$slug", "parentId": "root", "path": "post/:slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-DiRGdxLY.js", "imports": ["/assets/components-C_kpxqgJ.js", "/assets/WPPageTemplate-Bo9fKNpD.js"], "css": [] }, "routes/$slug": { "id": "routes/$slug", "parentId": "root", "path": ":slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-Dtu9r43m.js", "imports": ["/assets/components-C_kpxqgJ.js", "/assets/WPPageTemplate-Bo9fKNpD.js"], "css": [] } }, "url": "/assets/manifest-0e37634e.js", "version": "0e37634e" };
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
