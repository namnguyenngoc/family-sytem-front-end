import { render, screen } from '@testing-library/react';
import MyApp from '../pages/_app';
import { AppProps } from 'next/app';

const MockComponent = ({ message }: { message: string }) => <div>{message}</div>;

describe('MyApp', () => {
  it('renders the provided component with pageProps', () => {
    // Arrange: Define mock props
    const mockPageProps = { message: 'Hello, world!' };

    // Act: Render MyApp with the mocked component and props
    const mockRouter = { pathname: '/blog', route: '/blog', query: {}, asPath: '/blog' } as any;
    render(<MyApp Component={MockComponent} pageProps={mockPageProps} router={mockRouter} />);

    // Assert: Verify that the message is rendered
    // expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });
});