import { Link, Outlet } from 'react-router-dom';
import { RoutePaths } from '../../router/routePaths';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to={RoutePaths.LANDING} className={styles.logo}>
          RoomieMatch
        </Link>
        <nav className={styles.nav}>
          <Link to={RoutePaths.AUTH} className={styles.navLink}>
            Войти
          </Link>
          <Link to={RoutePaths.AUTH} className={styles.navLink}>
            Регистрация
          </Link>
        </nav>
      </header>

      <main className={styles.content}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>RoomieMatch</span>
            <span className={styles.footerTagline}>Поиск соседа по привычкам</span>
          </div>
          <nav className={styles.footerLinks}>
            <a href="#">О проекте</a>
            <a href="#">Правила</a>
            <a href="#">Конфиденциальность</a>
            <a href="#">Поддержка</a>
          </nav>
          <span className={styles.footerCopy}>© 2026</span>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
