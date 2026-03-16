import { Navigate } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';
import { ProtectedRoute } from '@/app/router/guards/ProtectedRoute';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const userRole = localStorage.getItem('userRole') ?? null;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to={RoutePaths.LANDING} />;
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
};
