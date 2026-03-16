import { Navigate } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const isAuth = localStorage.getItem('isAuth') === 'true';
  const userRole = localStorage.getItem('userRole') ?? 'user';

  if (!isAuth) {
    return <Navigate to={RoutePaths.AUTH} />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={RoutePaths.LANDING} />;
  }

  return children;
};
