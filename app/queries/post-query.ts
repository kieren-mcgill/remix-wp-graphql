export const GET_POST = `
  query GetPost($id: ID!) {
    post(id: $id, idType: URI) {
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