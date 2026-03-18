import { Outlet, useLocation } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';
import { PageShell } from '@/widgets/page-shell';

function getShellMode(pathname: string) {
  if (pathname.startsWith(RoutePaths.ONBOARDING_STEP_1)) return 'step-1';
  if (pathname.startsWith(RoutePaths.ONBOARDING_STEP_2)) return 'step-2';
  if (pathname.startsWith(RoutePaths.ONBOARDING_STEP_3)) return 'step-3';
  if (pathname.startsWith(RoutePaths.ONBOARDING_STEP_4)) return 'step-4';
  if (pathname.startsWith(RoutePaths.FILTERS)) return 'filters';
  if (pathname.startsWith(RoutePaths.USER_PROFILE_BASE)) return 'candidate';
  return 'discover';
}

const MainLayout = () => {
  const location = useLocation();

  return (
    <PageShell mode={getShellMode(location.pathname)}>
      <Outlet />
    </PageShell>
  );
};

export default MainLayout;
