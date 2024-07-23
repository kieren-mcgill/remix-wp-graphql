export const GET_MENU = `
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

