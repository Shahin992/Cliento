import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { getCookie } from '../utils/auth';

const RequireAuth = () => {
  const token = useAppSelector((state) => state.auth.token);
  const cookieToken = getCookie('cliento_token');

  if (!token && !cookieToken) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
