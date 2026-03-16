import { Navigate } from 'react-router-dom';
import { RoutePaths } from '../routePaths';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuth = localStorage.getItem('isAuth') === 'true';

  if (!isAuth) {
    return <Navigate to={RoutePaths.AUTH} />;
  }

  return children;
};
