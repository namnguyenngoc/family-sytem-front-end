"use client";  // Ensure this component runs in the browser

import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';

import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apollo-client';
// import ApolloProviderWrapper from '@/components/core/apollo-provider-wrapper';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <ApolloProvider client={client}>
          <LocalizationProvider>
            <UserProvider>
              <ThemeProvider>
                {
                children
                }
              </ThemeProvider>
            </UserProvider>
          </LocalizationProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
