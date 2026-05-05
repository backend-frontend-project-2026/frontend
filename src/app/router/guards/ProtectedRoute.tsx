import { Link } from 'react-router-dom';
import { Button } from 'antd';

import { RoutePaths } from '@/app/router/routePaths';
import { isAuthenticated } from '@/shared/api/auth/session';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!isAuthenticated()) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h1>🚫 Доступ запрещён</h1>
        <p>Вы не авторизованы</p>

        <Link to={RoutePaths.LANDING}>
          <Button type="primary">На главную</Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
