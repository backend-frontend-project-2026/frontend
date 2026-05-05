import { Outlet } from 'react-router-dom';
import AppHeader from '@/shared/ui/AppHeader/AppHeader';
import AppFooter from '@/shared/ui/AppFooter/AppFooter';
import styles from './AppLayout.module.css';

const AppLayout = () => {
  return (
    <div className={styles.layout}>
      <AppHeader />

      <main className={styles.content}>
        <Outlet />
      </main>

      <AppFooter />
    </div>
  );
};

export default AppLayout;