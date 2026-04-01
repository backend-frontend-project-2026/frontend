import { isAuthenticated, getStoredUser } from '@/shared/api/auth/session';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const NoAccess = () => (
  <div style={{ padding: 40, textAlign: 'center' }}>
    <h1>Доступ запрещён</h1>
    <p>У вас нет прав для просмотра этой страницы</p>
  </div>
);
export const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const user = getStoredUser();
  const role = user?.role || null;

  if (!isAuthenticated()) {
    return <NoAccess />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <NoAccess />;
  }

  return <>{children}</>;
};
