import { message } from 'antd';
import styles from './AppFooter.module.css';

const FOOTER_LINKS = ['О проекте', 'Правила', 'Конфиденциальность', 'Поддержка'];

const AppFooter = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const handleFooterLinkClick = () => {
    void messageApi.info('Функционал находится в разработке');
  };

  return (
    <>
      {contextHolder}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>RoomieMatch</span>
            <span className={styles.footerTagline}>Поиск соседа по привычкам</span>
          </div>
          <nav className={styles.footerLinks}>
            {FOOTER_LINKS.map((link) => (
              <button
                key={link}
                type="button"
                className={styles.footerLinkButton}
                onClick={handleFooterLinkClick}
              >
                {link}
              </button>
            ))}
          </nav>
          <span className={styles.footerCopy}>© 2026</span>
        </div>
      </footer>
    </>
  );
};

export default AppFooter;