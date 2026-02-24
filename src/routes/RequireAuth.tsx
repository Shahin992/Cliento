import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearAuth, setAuth } from '../features/auth/authSlice';
import { useMeQuery } from '../hooks/auth/useAuthQueries';
import { AppHttpError } from '../hooks/useAppQuery';
import { getAuthTokenFromCookie } from '../utils/auth';

const RequireAuth = () => {
  const user = useAppSelector((state) => state.auth.user);
  const hasToken = Boolean(getAuthTokenFromCookie());
  const shouldLoadMe = hasToken && !user;
  const dispatch = useAppDispatch();
  const { me, loading, error } = useMeQuery(shouldLoadMe);

  useEffect(() => {
    if (!hasToken && user) {
      dispatch(clearAuth());
      return;
    }

    if (me) {
      dispatch(setAuth({ user: me }));
      return;
    }

    if (error instanceof AppHttpError && (error.statusCode === 401 || error.statusCode === 403)) {
      dispatch(clearAuth());
    }
  }, [dispatch, error, hasToken, me, user]);

  if (!hasToken) {
    return <Navigate to="/signin" replace />;
  }

  // Wait for /me and Redux hydration before rendering nested protected routes.
  if (!user && (loading || Boolean(me))) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
