import { RoutePaths } from '../routePaths';

import LandingPage from '../../../pages/landing/ui/LandingPage';
import LoginPage from '../../../pages/auth/login/ui/LoginPage';
import RegisterPage from '../../../pages/auth/register/ui/RegisterPage';

export const routesConfig = [
  {
    path: RoutePaths.LANDING,
    element: <LandingPage />,
  },
  {
    path: RoutePaths.LOGIN,
    element: <LoginPage />,
  },
  {
    path: RoutePaths.REGISTER,
    element: <RegisterPage />,
  },
];
