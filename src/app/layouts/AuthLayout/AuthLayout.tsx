import { Link, Outlet } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';
import AppFooter from '@/shared/ui/AppFooter/AppFooter';
import styles from './AuthLayout.module.css';

const AuthLayout = () => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to={RoutePaths.LANDING} className={styles.logo}>
            RoomieMatch
          </Link>
        </div>
      </header>

      <main className={styles.content}>
        <Outlet />
      </main>

      <AppFooter />
    </div>
  );
};

export default AuthLayout;
