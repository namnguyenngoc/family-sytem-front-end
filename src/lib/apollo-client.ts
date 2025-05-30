import { ApolloClient, InMemoryCache } from '@apollo/client/core';

const getGraphqlUri = () => {
  if (typeof window !== 'undefined') {
    // On client: use current domain
    return `${window.location.protocol}//${window.location.host}/graphql`;
  }
  // On server: fallback or use env
  return process.env.NEXT_PUBLIC_GRAPHQL_URI || 'http://localhost:9000/graphql';
};

const client = new ApolloClient({
  uri: getGraphqlUri(),
  cache: new InMemoryCache(),
});

export default client;