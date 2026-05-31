import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { AppProvider } from './store/AppContext';
import './styles/index.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <AppProvider>
      <Outlet />
    </AppProvider>
  );
}

export function ErrorBoundary({ error }: { error: unknown }) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <div>404 — Page not found</div>;
  }
  return <div>Something went wrong</div>;
}
