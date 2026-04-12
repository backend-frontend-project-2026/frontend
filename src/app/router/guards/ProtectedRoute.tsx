import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/shared/api/auth/session';
import { RoutePaths } from '@/app/router/routePaths';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!isAuthenticated()) {
    return <Navigate to={RoutePaths.LOGIN} replace />;
  }

  return <>{children}</>;
};
