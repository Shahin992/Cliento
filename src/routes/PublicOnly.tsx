import { Navigate, Outlet } from 'react-router-dom';
import { getAuthTokenFromCookie } from '../utils/auth';

const PublicOnly = () => {
  const hasToken = Boolean(getAuthTokenFromCookie());

  if (hasToken) {
    return <Navigate to={'/dashboard'} replace />;
  }

  return <Outlet />;
};

export default PublicOnly;
