import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

import { useAppSelector } from '../app/hooks';
import { getCookie } from '../utils/auth';
import { hasActiveAccess } from '../utils/user';

const PublicOnly = () => {
  const user = useAppSelector((state) => state.auth.user);
  const initialized = useAppSelector((state) => state.auth.initialized);
  const hasToken = Boolean(getCookie('cliento_token'));

  if (!initialized) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (user || hasToken) {
    const redirectTo = hasActiveAccess(user?.accessExpiresAt)
      ? '/dashboard'
      : '/settings/subscription';
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default PublicOnly;
