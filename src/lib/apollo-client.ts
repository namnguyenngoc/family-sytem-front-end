// src/lib/apollo-client.ts
import { ApolloClient, InMemoryCache } from '@apollo/client/core';

const client = new ApolloClient({
  uri: 'http://localhost:9000/graphql', // Replace with your GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client;