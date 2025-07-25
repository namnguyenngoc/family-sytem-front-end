"use client";

import * as React from 'react';
import { ApolloProvider } from "@apollo/client";
import client from '@/lib/apollo-client';

export default function ApolloProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
