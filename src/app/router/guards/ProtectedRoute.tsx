import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return (
      <div>
        <h2>Доступ запрещен</h2>
        <p>Вы должны быть авторизованы для просмотра этой страницы.</p>
      </div>
    );
  }

  return <>{children}</>;
};
