export const GET_PAGE = `
  query GetPage($id: ID!) {
    page(id: $id, idType: URI) {
        title
        link
      seo {
        breadcrumbs {
          url
          text
        }
      }
    }
  }
`;
