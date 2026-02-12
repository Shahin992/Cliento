import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

import { useAppSelector } from '../app/hooks';

const PublicOnly = () => {
  const user = useAppSelector((state) => state.auth.user);
  const initialized = useAppSelector((state) => state.auth.initialized);

  if (!initialized) {
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
