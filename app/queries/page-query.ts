import { SEO_FRAGMENT } from "~/queries/fragments";

export const GET_PAGE = `
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
