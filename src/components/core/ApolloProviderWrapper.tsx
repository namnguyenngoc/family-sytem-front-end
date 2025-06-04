"use client";

import * as React from 'react';
import { ApolloProvider } from "@apollo/client";
import client from '@/lib/apollo-client';
import { SnackbarProvider } from 'notistack';

export default function ApolloProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </SnackbarProvider>
  );
}