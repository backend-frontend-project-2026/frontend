import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RoutePaths } from './routePaths';
import { ProtectedRoute } from '@/app/router/guards/ProtectedRoute';
import { RoleRoute } from '@/app/router/guards/RoleRoute';
import AdminReportsPage from '@/pages/admin/reports/ui/AdminReportsPage';

import LandingPage from '@/pages/landing/ui/LandingPage';
import AuthPage from '@/pages/auth/ui/AuthPage';
import VerifyEmailPage from '@/pages/auth/verify-email/ui/VerifyEmailPage';
import VerifyCodePage from '@/pages/auth/verify-code/ui/VerifyCodePage';
import ForgotPasswordPage from '@/pages/auth/forgot-password/ui/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/reset-password/ui/ResetPasswordPage';
import SuccessPage from '@/pages/auth/success/ui/SuccessPage';
import ErrorPage from '@/pages/auth/error/ui/ErrorPage';

import DiscoverPage from '@/pages/discover/ui/DiscoverPage';
import MatchesPage from '@/pages/matches/ui/MatchesPage';
import ChatsPage from '@/pages/chats/ui/ChatsPage';
import ProfilePage from '@/pages/profile/ui/ProfilePage';
import SettingsPage from '@/pages/settings/ui/SettingsPage';

import NotFoundPage from '@/pages/not-found/ui/NotFoundPage';

const TodoPage = () => <div style={{ padding: 40 }}>TODO</div>;

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RoutePaths.LANDING} element={<LandingPage />} />

        <Route path={RoutePaths.AUTH} element={<AuthPage />} />
        <Route path={RoutePaths.VERIFY_EMAIL} element={<VerifyEmailPage />} />
        <Route path={RoutePaths.VERIFY_CODE} element={<VerifyCodePage />} />
        <Route path={RoutePaths.SUCCESS} element={<SuccessPage />} />
        <Route path={RoutePaths.ERROR} element={<ErrorPage />} />
        <Route path={RoutePaths.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={RoutePaths.RESET_PASSWORD} element={<ResetPasswordPage />} />
        <Route path={RoutePaths.ONBOARDING} element={<TodoPage />} />
        <Route path={RoutePaths.ONBOARDING_STEP_1} element={<TodoPage />} />
        <Route path={RoutePaths.ONBOARDING_STEP_2} element={<TodoPage />} />
        <Route path={RoutePaths.ONBOARDING_STEP_3} element={<TodoPage />} />
        <Route path={RoutePaths.ONBOARDING_STEP_4} element={<TodoPage />} />

        <Route
          path={RoutePaths.DISCOVER}
          element={
            <ProtectedRoute>
              <DiscoverPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={RoutePaths.MATCHES}
          element={
            <ProtectedRoute>
              <MatchesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={RoutePaths.CHATS}
          element={
            <ProtectedRoute>
              <ChatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={RoutePaths.PROFILE}
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={RoutePaths.SETTINGS}
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={RoutePaths.ADMIN_REPORTS}
          element={
            <RoleRoute allowedRoles={['admin']}>
              <AdminReportsPage />
            </RoleRoute>
          }
        />

        <Route path={RoutePaths.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
