import { Link, NavLink } from 'react-router-dom';
import { Input, message } from 'antd';
import { RoutePaths } from '@/app/router/routePaths';
import styles from './AppHeader.module.css';

const navItems = [
  { label: 'Поиск', path: RoutePaths.DISCOVER },
  { label: 'Мэтчи', path: RoutePaths.MATCHES },
  { label: 'Профиль', path: RoutePaths.PROFILE },
];

const AppHeader = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const handleSearchChange = () => {
    void messageApi.open({
      key: 'header-search-in-development',
      type: 'info',
      content: 'Функционал находится в разработке',
    });
  };

  return (
    <>
      {contextHolder}
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
          <Input
            placeholder="Поиск по мэтчам/чатам..."
            className={styles.search}
            allowClear
            onChange={handleSearchChange}
          />
        </div>
      </div>
      </header>
    </>
  );
};

export default AppHeader;