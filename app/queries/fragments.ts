export const SEO_FRAGMENT = `
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