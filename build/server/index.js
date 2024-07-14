import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer, NavLink, useMatches, Outlet, Meta, Links, ScrollRestoration, Scripts, useLoaderData } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as process$1 from "node:process";
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
  const homepageName = "Home";
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  const breadcrumbs = (_a = lastMatch.data) == null ? void 0 : _a.breadcrumbs;
  const showBreadcrumb = breadcrumbs ? breadcrumbs[1].name !== homepageName : false;
  return /* @__PURE__ */ jsx(Fragment, { children: breadcrumbs && showBreadcrumb && /* @__PURE__ */ jsx("nav", { className: "h-8 bg-amber-400", "aria-label": "breadcrumb", children: /* @__PURE__ */ jsx("ol", { className: "flex gap-3", children: breadcrumbs.map(
    (breadcrumb, index) => {
      const itemURLObj = breadcrumb.item && new URL(breadcrumb.item);
      const relPath = itemURLObj ? itemURLObj.pathname : "#";
      return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        BreadcrumbLink,
        {
          path: relPath,
          name: breadcrumb.name,
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
const getYoastBreadcrumb = (data) => {
  if (!data) {
    console.error("Could not find yoast breadcrumb data");
    return null;
  }
  const yoastBreadcrumbArray = data.yoast_head_json.schema["@graph"];
  const yoastBreadcrumbObject = yoastBreadcrumbArray.find((item) => item["@type"] === "BreadcrumbList");
  if (yoastBreadcrumbObject) {
    return yoastBreadcrumbObject.itemListElement;
  } else {
    console.error("Could not find yoast breadcrumb data");
    return null;
  }
};
const baseUrl$1 = process.env.WORDPRESS_API_URL;
async function fetchPage(slug) {
  const response = await fetch(`${baseUrl$1}/wp-json/wp/v2/pages?slug=${slug}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch page with slug: ${slug}`);
  }
  const pages = await response.json();
  const page = pages.length > 0 ? pages[0] : null;
  const breadcrumbs = getYoastBreadcrumb(page);
  return { page, breadcrumbs };
}
const pageLoader = async (params) => {
  const { grandParentSlug, parentSlug, slug } = params;
  const { page, breadcrumbs } = await fetchPage(slug);
  let isCorrectPath = false;
  if (page) {
    const pageRelPath = new URL(page.link).pathname;
    if (grandParentSlug && parentSlug) {
      isCorrectPath = pageRelPath === `/${grandParentSlug}/${parentSlug}/${slug}/`;
    } else if (parentSlug) {
      isCorrectPath = pageRelPath === `/${parentSlug}/${slug}/`;
    } else {
      isCorrectPath = pageRelPath === `/${slug}/`;
    }
  }
  return { page, isCorrectPath, breadcrumbs };
};
const getYoastMeta = (page) => {
  const metaData = page && page.yoast_head_json;
  return [
    { title: (metaData == null ? void 0 : metaData.title) || "Site Title" },
    { name: "description", content: (metaData == null ? void 0 : metaData.description) || "" },
    { name: "robots", content: (metaData == null ? void 0 : metaData.robots) || "index, follow" },
    { rel: "canonical", href: (metaData == null ? void 0 : metaData.canonical) || "" },
    { property: "og:title", content: (metaData == null ? void 0 : metaData.og_title) || (metaData == null ? void 0 : metaData.title) || "Site Title" },
    { property: "og:description", content: (metaData == null ? void 0 : metaData.og_description) || (metaData == null ? void 0 : metaData.description) || "" },
    { property: "og:image", content: (metaData == null ? void 0 : metaData.og_image) || "" },
    { property: "og:url", content: (metaData == null ? void 0 : metaData.canonical) || "" },
    { name: "twitter:card", content: (metaData == null ? void 0 : metaData.twitter_card) || "summary" },
    { name: "twitter:title", content: (metaData == null ? void 0 : metaData.twitter_title) || (metaData == null ? void 0 : metaData.title) || "Site Title" },
    { name: "twitter:description", content: (metaData == null ? void 0 : metaData.twitter_description) || (metaData == null ? void 0 : metaData.description) || "" },
    { name: "twitter:image", content: (metaData == null ? void 0 : metaData.twitter_image) || "" },
    { name: "keywords", content: (metaData == null ? void 0 : metaData.keywords) || "" }
  ];
};
async function loader$5({ params }) {
  const { grandParentSlug, parentSlug, slug } = params;
  const { page, isCorrectPath, breadcrumbs } = await pageLoader({ grandParentSlug, parentSlug, slug });
  if (!page || !isCorrectPath) {
    throw new Response("Page not found", { status: 404 });
  }
  return { page, breadcrumbs };
}
const handle$3 = {};
const meta$3 = ({ data }) => {
  if (!data) {
    return [];
  }
  return getYoastMeta(data.page);
};
const Page$2 = () => {
  const { page } = useLoaderData();
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: page.title.rendered }) });
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Page$2,
  handle: handle$3,
  loader: loader$5,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
async function loader$4({ params }) {
  const { parentSlug, slug } = params;
  const { page, isCorrectPath, breadcrumbs } = await pageLoader({ parentSlug, slug });
  if (!page || !isCorrectPath) {
    throw new Response("Page not found", { status: 404 });
  }
  return { page, breadcrumbs };
}
const handle$2 = {};
const meta$2 = ({ data }) => {
  if (!data) {
    return [];
  }
  return getYoastMeta(data.page);
};
const Page$1 = () => {
  const { page } = useLoaderData();
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: page.title.rendered }) });
};
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Page$1,
  handle: handle$2,
  loader: loader$4,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const loader$3 = () => {
  const baseUrl2 = process$1.env.WORDPRESS_API_URL;
  const robotText = `
        User-agent: Googlebot
        Disallow: /nogooglebot/
        User-agent: *
        Allow: /
        Sitemap: ${baseUrl2}/sitemap_index.xml`;
  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain"
    }
  });
};
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const baseUrl = process.env.WORDPRESS_API_URL;
async function fetchPost(slug) {
  const response = await fetch(`${baseUrl}/wp-json/wp/v2/posts?slug=${slug}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch page with slug: ${slug}`);
  }
  const posts = await response.json();
  const post = posts.length > 0 ? posts[0] : null;
  const breadcrumbs = getYoastBreadcrumb(post);
  return { post, breadcrumbs };
}
async function loader$2({ params }) {
  const { slug } = params;
  const { post, breadcrumbs } = await fetchPost(slug);
  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }
  return { post, breadcrumbs };
}
const handle$1 = {};
const Post = () => {
  const { post } = useLoaderData();
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: post.title.rendered }) });
};
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Post,
  handle: handle$1,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
async function loader$1() {
  const slug = "home";
  const { page, breadcrumbs } = await fetchPage(slug);
  if (!page) {
    throw new Response("Homepage not found", { status: 404 });
  }
  return { page, breadcrumbs };
}
const meta$1 = ({ data }) => {
  if (!data) {
    return [];
  }
  return getYoastMeta(data.page);
};
const HomePage = () => {
  const { page } = useLoaderData();
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { className: "text-red-700", children: page.title.rendered }) });
};
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: HomePage,
  loader: loader$1,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
async function loader({ params }) {
  const { slug } = params;
  const { page, isCorrectPath, breadcrumbs } = await pageLoader({ slug });
  if (!page || !isCorrectPath) {
    throw new Response("Page not found", { status: 404 });
  }
  return { page, breadcrumbs };
}
const handle = {};
const meta = ({ data }) => {
  if (!data) {
    return [];
  }
  return getYoastMeta(data.page);
};
const Page = () => {
  const { page } = useLoaderData();
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { children: page.title.rendered }) });
};
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Page,
  handle,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BU8uL3S5.js", "imports": ["/assets/components-XXrZDpAO.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-DqcmrcFQ.js", "imports": ["/assets/components-XXrZDpAO.js"], "css": ["/assets/root-BAG6_5Rt.css"] }, "routes/$grandParentSlug.$parentSlug.$slug": { "id": "routes/$grandParentSlug.$parentSlug.$slug", "parentId": "root", "path": ":grandParentSlug/:parentSlug/:slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-DsVMwb1m.js", "imports": ["/assets/components-XXrZDpAO.js", "/assets/get-yoast-meta-BJwIJVCd.js"], "css": [] }, "routes/$parentSlug.$slug": { "id": "routes/$parentSlug.$slug", "parentId": "root", "path": ":parentSlug/:slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-BWD5vzIC.js", "imports": ["/assets/components-XXrZDpAO.js", "/assets/get-yoast-meta-BJwIJVCd.js"], "css": [] }, "routes/[robots.txt]": { "id": "routes/[robots.txt]", "parentId": "root", "path": "robots.txt", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_robots.txt_-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/post.$slug": { "id": "routes/post.$slug", "parentId": "root", "path": "post/:slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-WR7gjZ_a.js", "imports": ["/assets/components-XXrZDpAO.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-Dzpf5CQj.js", "imports": ["/assets/components-XXrZDpAO.js", "/assets/get-yoast-meta-BJwIJVCd.js"], "css": [] }, "routes/$slug": { "id": "routes/$slug", "parentId": "root", "path": ":slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-CiW4Xvcl.js", "imports": ["/assets/components-XXrZDpAO.js", "/assets/get-yoast-meta-BJwIJVCd.js"], "css": [] } }, "url": "/assets/manifest-212b5434.js", "version": "212b5434" };
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
