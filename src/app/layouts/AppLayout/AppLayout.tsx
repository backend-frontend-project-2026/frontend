import { Link, NavLink, Outlet } from 'react-router-dom';
import { Input } from 'antd';
import { RoutePaths } from '@/app/router/routePaths';
import AppFooter from '@/shared/ui/AppFooter/AppFooter';
import styles from './AppLayout.module.css';

const navItems = [
  { label: 'Поиск', path: RoutePaths.DISCOVER },
  { label: 'Мэтчи', path: RoutePaths.MATCHES },
  { label: 'Чаты', path: RoutePaths.CHATS },
  { label: 'Профиль', path: RoutePaths.PROFILE },
];

const AppLayout = () => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to={RoutePaths.LANDING} className={styles.logo}>
            RoomieMatch
          </Link>
          <nav className={styles.nav}>
            {navItems.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className={styles.actions}>
            <Input placeholder="Поиск по мэтчам/чатам..." className={styles.search} />
            <div className={styles.avatar} />
          </div>
        </div>
      </header>

      <main className={styles.content}>
        <Outlet />
      </main>

      <AppFooter />
    </div>
  );
};

export default AppLayout;
