import { NavLink, Outlet } from 'react-router-dom';
import { Input } from 'antd';
import { RoutePaths } from '../../router/routePaths';
import styles from './AppLayout.module.css';

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5" stroke="#888" strokeWidth="1.5" />
    <path d="M11 11L14 14" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

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
        <NavLink to={RoutePaths.LANDING} className={styles.logo}>
          RoomieMatch
        </NavLink>

        <nav className={styles.nav}>
          {navItems.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <Input prefix={<SearchIcon />} placeholder="Поиск" className={styles.search} />
      </header>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
