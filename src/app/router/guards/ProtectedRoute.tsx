import { Navigate } from 'react-router-dom';
import { RoutePaths } from '../routePaths';

interface ProtectedRouteProps {
  isAuth: boolean;
  children: React.ReactNode;
}

export const ProtectedRoute = ({ isAuth, children }: ProtectedRouteProps) => {
  if (!isAuth) {
    return <Navigate to={RoutePaths.LOGIN} />;
  }

  return children;
};
