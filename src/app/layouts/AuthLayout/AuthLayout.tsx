import { Link, Outlet } from 'react-router-dom';
import { RoutePaths } from '../../router/routePaths';
import styles from './AuthLayout.module.css';

const AuthLayout = () => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to={RoutePaths.LANDING} className={styles.logo}>
          RoomieMatch
        </Link>
      </header>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
