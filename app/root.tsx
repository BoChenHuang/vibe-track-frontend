import { useEffect } from 'react';
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { AppProvider } from './store/AppContext';
import { useApp } from './store/AppContext';
import { getHealth, getRateLimit } from './lib/api';
import { loadHistory, loadPrefs, loadRateTimes } from './lib/storage';
import { applyTheme } from './lib/themes';
import { Atmosphere } from './components/layout/Atmosphere';
import { Topbar } from './components/layout/Topbar';
import { RateLimitToast } from './components/ui/RateLimitToast';
import { BootingScreen } from './components/ui/BootingScreen';
import { TweaksPanel } from './components/ui/TweaksPanel';
import './styles/index.css';

function AppInit() {
  const { dispatch } = useApp();

  useEffect(() => {
    const history = loadHistory();
    if (history) dispatch({ type: 'restoreHistory', entries: history });

    const prefs = loadPrefs();
    if (prefs) {
      dispatch({ type: 'restorePrefs', prefs });
      applyTheme(prefs.theme);
    }

    const rateTimes = loadRateTimes();
    if (rateTimes) dispatch({ type: 'restoreRateTimes', times: rateTimes });
  }, [dispatch]);

  useEffect(() => {
    let cancelled = false;
    let retryTimeout: ReturnType<typeof setTimeout>;

    async function tryHealth(attempt: number): Promise<void> {
      try {
        await getHealth();
        if (cancelled) return;
        dispatch({ type: 'setBootingStatus', status: 'ready' });
        try {
          const rl = await getRateLimit();
          if (!cancelled) {
            dispatch({
              type: 'updateRateLimit',
              remaining: rl.remaining,
              limit: rl.limit,
              resetAt: rl.reset_at,
            });
          }
        } catch { /* rate limit sync is non-critical */ }
      } catch {
        if (cancelled) return;
        if (attempt < 3) {
          retryTimeout = setTimeout(() => { void tryHealth(attempt + 1); }, 5000);
        } else {
          dispatch({ type: 'setBootingStatus', status: 'error' });
        }
      }
    }

    void tryHealth(1);

    return () => {
      cancelled = true;
      clearTimeout(retryTimeout);
    };
  }, [dispatch]);

  return null;
}

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
      <AppInit />
      <BootingScreen />
      <Atmosphere />
      <Topbar />
      <Outlet />
      <RateLimitToast />
      <TweaksPanel />
    </AppProvider>
  );
}

export function ErrorBoundary({ error }: { error: unknown }) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <div>404 — Page not found</div>;
  }
  return <div>Something went wrong</div>;
}
