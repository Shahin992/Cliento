import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { hasActiveAccess } from '../utils/user';

const ALLOWED_WITHOUT_ACCESS = new Set([
  '/settings/subscription',
  '/settings/subscription/create',
]);

const RequireAccess = () => {
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const isAccessActive = hasActiveAccess(user?.accessExpiresAt);

  if (isAccessActive) {
    return <Outlet />;
  }

  if (ALLOWED_WITHOUT_ACCESS.has(location.pathname)) {
    return <Outlet />;
  }

  return <Navigate to="/settings/subscription" replace />;
};

export default RequireAccess;
