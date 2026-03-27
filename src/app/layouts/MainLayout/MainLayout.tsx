import { Outlet, useLocation } from 'react-router-dom';
import { PageShell } from '@/widgets/page-shell';
import { getShellMode } from './lib/getShellMode';
const MainLayout = () => {
  const location = useLocation();

  return (
    <PageShell mode={getShellMode(location.pathname)}>
      <Outlet />
    </PageShell>
  );
};

export default MainLayout;
