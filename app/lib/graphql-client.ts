import { GraphQLClient } from 'graphql-request';
import * as process from "process";

const baseURL = process.env.WORDPRESS_API_URL

const endpoint =  `${baseURL}/graphql`

const client = new GraphQLClient(endpoint, {
});

export default client;