// import WordPressPost from "../../types/wordpress.interface";
// import getYoastBreadcrumb from "~/lib/get-yoast-breadcrumb";
// import FetchPostResult from "~/types/fetch-post-result.interface";
//
// const baseUrl = process.env.WORDPRESS_API_URL;
//
// export async function fetchPost(slug : string) : Promise<FetchPostResult> {
//
//     const response = await fetch(`${baseUrl}/wp-json/wp/v2/posts?slug=${slug}`);
//
//     if (!response.ok) {
//
//         throw new Error(`Failed to fetch page with slug: ${slug}`);
//     }
//
//     const posts : WordPressPost[] = await response.json();
//
//    const post = posts.length > 0 ? posts[0] : null;
//
//    const breadcrumbs = getYoastBreadcrumb(post)
//
//     return {post, breadcrumbs}
// }
