import { ApolloClient, InMemoryCache } from '@apollo/client/core';

console.log('Initializing Apollo Client...', process.env.NEXT_PUBLIC_GRAPHQL_URI);

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || 'http://localhost:9000/graphql',
  cache: new InMemoryCache(),
});

export default client;