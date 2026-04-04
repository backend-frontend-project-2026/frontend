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
      </div>
    );
  }

  return <>{children}</>;
};
