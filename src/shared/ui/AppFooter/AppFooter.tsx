import { Link } from 'react-router-dom';
import styles from './AppFooter.module.css';

const AppFooter = () => (
  <footer className={styles.footer}>
    <div className={styles.footerInner}>
      <div className={styles.footerBrand}>
        <span className={styles.footerLogo}>RoomieMatch</span>
        <span className={styles.footerTagline}>Поиск соседа по привычкам</span>
      </div>
      <nav className={styles.footerLinks}>
        <Link to="#">О проекте</Link>
        <Link to="#">Правила</Link>
        <Link to="#">Конфиденциальность</Link>
        <Link to="#">Поддержка</Link>
      </nav>
      <span className={styles.footerCopy}>© 2026</span>
    </div>
  </footer>
);

export default AppFooter;
