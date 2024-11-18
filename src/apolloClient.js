// src/apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://172.24.116.200:9002/graphql', // Replace with your GraphQL endpoint
  }),
  cache: new InMemoryCache(),
});

export default client;