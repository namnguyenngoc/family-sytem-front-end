import { Router } from 'next/dist/client/router';

export function createMockRouter(router: Partial<Router>): Router {
  return {
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    basePath: '',
    pageLoader: { loadPage: jest.fn() } as any,
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    clc: jest.fn(), // Add this required property
    components: {}, // Add this required property
    sdc: {}, // Add this required property for prefetch cache
    sbc: {}, // Add this required property for static build cache
    sub: jest.fn(), // Add this required subscription property
    isPreview: false,
    isLocaleDomain: false,
    state: {},
    _key: '',
    change: jest.fn(),
    set: jest.fn(),
    _bps: jest.fn(), // Add this required property
    ...router, // Merge any custom overrides
  };
}
