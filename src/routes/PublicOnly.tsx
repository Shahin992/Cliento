import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearAuth, setAuth } from '../features/auth/authSlice';
import { useMeQuery } from '../hooks/auth/useAuthQueries';
import { AppHttpError } from '../hooks/useAppQuery';

const PublicOnly = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const initialized = useAppSelector((state) => state.auth.initialized);
  const { me, loading, error } = useMeQuery(!user);

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

  if (!initialized || (!user && loading)) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicOnly;
