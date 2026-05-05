import { Link, Navigate } from 'react-router-dom';
import { isAuthenticated, getStoredUser } from '@/shared/api/auth/session';
import { RoutePaths } from '@/app/router/routePaths';
import { Button, Typography } from 'antd';

const { Title, Text } = Typography;

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const NoAccess = () => (
  <div style={{ padding: 40, textAlign: 'center' }}>
    <Title level={2} style={{ marginBottom: 16 }}>
      Доступ запрещён
    </Title>

    <Text type="secondary">У вас нет прав для просмотра этой страницы</Text>

    <div style={{ marginTop: 24 }}>
      <Link to={RoutePaths.LANDING}>
        <Button type="primary">На главную</Button>
      </Link>
    </div>
  </div>
);

export const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const user = getStoredUser();
  const role = user?.role || null;

  if (!isAuthenticated()) {
    return <Navigate to={RoutePaths.LOGIN} replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <NoAccess />;
  }

  return <>{children}</>;
};