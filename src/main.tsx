import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';

import App from './App';
import { store } from './app/store';
import { setAuth } from './features/auth/authSlice';
import theme from './theme';
import { ToastProvider } from './common/ToastProvider';
import { decodeBase64, getCookie } from './utils/auth';
import './index.css';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });
}

const tokenCookie = getCookie('cliento_token');
const userCookie = getCookie('cliento_user');
if (userCookie) {
  try {
    const user = JSON.parse(decodeBase64(userCookie));
    const token = tokenCookie ? decodeBase64(tokenCookie) : null;
    store.dispatch(setAuth({ user, token }));
  } catch {
    // ignore malformed cookie
  }
}

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
