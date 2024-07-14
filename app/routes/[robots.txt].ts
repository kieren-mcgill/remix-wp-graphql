import * as process from "node:process";
export const loader = () => {

    const baseUrl = process.env.WORDPRESS_API_URL

    const robotText = `
        User-agent: Googlebot
        Disallow: /nogooglebot/
        User-agent: *
        Allow: /
        Sitemap: ${baseUrl}/sitemap_index.xml`;

    return new Response(robotText, {
        status: 200,
        headers: {
            "Content-Type": "text/plain",
        },
    });
};