import { GraphQLClient } from 'graphql-request';

const createGraphQLClient = (baseURL: string) => {
    const endpoint = `${baseURL}/graphql`;
    return new GraphQLClient(endpoint);
};

export default createGraphQLClient;