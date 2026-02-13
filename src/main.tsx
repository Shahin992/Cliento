import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';

import App from './App';
import { store } from './app/store';
import { clearAuth, setAuth, setAuthInitialized } from './features/auth/authSlice';
import theme from './theme';
import { ToastProvider } from './common/ToastProvider';
import { getCookie, removeCookie } from './utils/auth';
import { meQueryOptions } from './hooks/auth/useAuthQueries';
import { queryClient } from './lib/queryClient';
import { AppHttpError } from './hooks/useAppQuery';
import './index.css';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });
}

void (async () => {
  const token = getCookie('cliento_token');
  if (!token) {
    store.dispatch(setAuthInitialized(true));
    return;
  }

  try {
    const user = await queryClient.fetchQuery(meQueryOptions());
    if (user) {
      store.dispatch(setAuth({ user }));
      return;
    }
  } catch (error) {
    if (error instanceof AppHttpError && (error.statusCode === 401 || error.statusCode === 403)) {
      removeCookie('cliento_token');
      store.dispatch(clearAuth());
      return;
    }
  }

  store.dispatch(setAuthInitialized(true));
})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
