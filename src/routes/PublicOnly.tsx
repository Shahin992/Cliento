import { Navigate, Outlet } from 'react-router-dom';

import { useAppSelector } from '../app/hooks';
import { getCookie } from '../utils/auth';

const PublicOnly = () => {
  const user = useAppSelector((state) => state.auth.user);
  const initialized = useAppSelector((state) => state.auth.initialized);
  const cookieToken = getCookie('cliento_token');

  if (!initialized) {
    return null;
  }

  if (cookieToken || user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicOnly;
