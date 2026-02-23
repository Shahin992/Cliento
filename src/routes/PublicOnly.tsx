import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearAuth, setAuth } from '../features/auth/authSlice';
import { useMeQuery } from '../hooks/auth/useAuthQueries';
import { AppHttpError } from '../hooks/useAppQuery';
import { hasActiveAccess } from '../utils/user';

const PublicOnly = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const initialized = useAppSelector((state) => state.auth.initialized);
  const shouldLoadMe = !user;
  const { me, loading, error } = useMeQuery(shouldLoadMe);

  useEffect(() => {
    if (user) return;

    if (me) {
      dispatch(setAuth({ user: me }));
      return;
    }

    if (error instanceof AppHttpError && (error.statusCode === 401 || error.statusCode === 403)) {
      dispatch(clearAuth());
    }
  }, [dispatch, error, me, user]);

  if (!initialized || (shouldLoadMe && loading)) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (user) {
    const redirectTo = hasActiveAccess(user.accessExpiresAt)
      ? '/dashboard'
      : '/settings/subscription';
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default PublicOnly;
