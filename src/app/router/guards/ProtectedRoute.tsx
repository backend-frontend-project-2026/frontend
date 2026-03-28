import { Navigate } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';
import { isAuthenticated } from '@/shared/api/auth/session';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!isAuthenticated()) {
    return <Navigate to={RoutePaths.AUTH} />;
  }

  return children;
};
