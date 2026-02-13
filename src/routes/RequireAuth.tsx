import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearAuth, setAuth } from '../features/auth/authSlice';
import { useMeQuery } from '../hooks/auth/useAuthQueries';
import { AppHttpError } from '../hooks/useAppQuery';

const RequireAuth = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [checking, setChecking] = useState(!user);
  const { me, loading, error } = useMeQuery(!user);

  useEffect(() => {
    if (user) {
      setChecking(false);
      return;
    }

    if (me) {
      dispatch(setAuth({ user: me }));
      setChecking(false);
      return;
    }

    if (error instanceof AppHttpError && (error.statusCode === 401 || error.statusCode === 403)) {
      dispatch(clearAuth());
      setChecking(false);
      return;
    }

    if (!loading && !me && !error) {
      setChecking(false);
    }
  }, [dispatch, error, loading, me, user]);

  if (checking || loading) {
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
