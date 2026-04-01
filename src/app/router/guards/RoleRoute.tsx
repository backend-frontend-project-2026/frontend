// RoleRoute.tsx
import React from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import styles from './RoleRoute.module.css';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const userRole = localStorage.getItem('userRole');

  if (!userRole) {
    return (
      <div className={styles.noAccess}>
        <h2>Доступ запрещен</h2>
        <p>Вы должны быть авторизованы для просмотра этой страницы.</p>
      </div>
    );
  }

  if (!allowedRoles.includes(userRole)) {
    return (
      <div className={styles.noAccess}>
        <h2>Доступ запрещен</h2>
        <p>У вас нет прав для просмотра этой страницы.</p>
      </div>
    );
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
};
