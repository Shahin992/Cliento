import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';

import App from './App';
import { store } from './app/store';
import { clearAuth, setAuth, setAuthInitialized } from './features/auth/authSlice';
import theme from './theme';
import { ToastProvider } from './common/ToastProvider';
import { getCookie, removeCookie } from './utils/auth';
import { getMeProfile } from './services/auth';
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

  const response = await getMeProfile();
  if (response.success && response.data) {
    store.dispatch(setAuth({ user: response.data }));
    return;
  }

  if (response.statusCode === 401 || response.statusCode === 403) {
    removeCookie('cliento_token');
    store.dispatch(clearAuth());
    return;
  }

  store.dispatch(setAuthInitialized(true));
})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
