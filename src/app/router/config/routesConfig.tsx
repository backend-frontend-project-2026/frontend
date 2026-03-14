import { RoutePaths } from '../routePaths';
import { ProtectedRoute } from '../guards/ProtectedRoute';

import LandingPage from '../../../pages/landing/ui/LandingPage';
import LoginPage from '../../../pages/auth/login/ui/LoginPage';
import RegisterPage from '../../../pages/auth/register/ui/RegisterPage';

import DiscoverPage from '../../../pages/discover/ui/DiscoverPage';
import MatchesPage from '../../../pages/matches/ui/MatchesPage';
import ChatsPage from '../../../pages/chats/ui/ChatsPage';
import ProfilePage from '../../../pages/profile/ui/ProfilePage';
import SettingsPage from '../../../pages/settings/ui/SettingsPage';

import NotFoundPage from '../../../pages/not-found/ui/NotFoundPage';

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

  {
    path: RoutePaths.DISCOVER,
    element: (
      <ProtectedRoute isAuth={true}>
        <DiscoverPage />
      </ProtectedRoute>
    ),
  },

  {
    path: RoutePaths.MATCHES,
    element: (
      <ProtectedRoute isAuth={true}>
        <MatchesPage />
      </ProtectedRoute>
    ),
  },

  {
    path: RoutePaths.CHATS,
    element: (
      <ProtectedRoute isAuth={true}>
        <ChatsPage />
      </ProtectedRoute>
    ),
  },

  {
    path: RoutePaths.PROFILE,
    element: (
      <ProtectedRoute isAuth={true}>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },

  {
    path: RoutePaths.SETTINGS,
    element: (
      <ProtectedRoute isAuth={true}>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },

  {
    path: RoutePaths.NOT_FOUND,
    element: <NotFoundPage />,
  },
];
