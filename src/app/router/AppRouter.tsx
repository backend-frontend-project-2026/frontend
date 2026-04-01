import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';
import { RoleRoute } from '@/app/router/guards/RoleRoute';

import AuthLayout from '@/app/layouts/AuthLayout/AuthLayout';
import AppLayout from '@/app/layouts/AppLayout/AppLayout';

import LandingPage from '@/pages/landing/ui/LandingPage';
import AuthPage from '@/pages/auth/ui/AuthPage';
import VerifyEmailPage from '@/pages/auth/verify-email/ui/VerifyEmailPage';
import VerifyCodePage from '@/pages/auth/verify-code/ui/VerifyCodePage';
import SuccessPage from '@/pages/auth/success/ui/SuccessPage';
import ErrorPage from '@/pages/auth/error/ui/ErrorPage';
import ForgotPasswordPage from '@/pages/auth/forgot-password/ui/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/reset-password/ui/ResetPasswordPage';

import DiscoverPage from '@/pages/discover/ui/DiscoverPage';
import MatchesPage from '@/pages/matches/ui/MatchesPage';
import ProfilePage from '@/pages/profile/ui/ProfilePage';
import SettingsPage from '@/pages/settings/ui/SettingsPage';
import AdminReportsPage from '@/pages/admin/reports/ui/AdminReportsPage';

import ChatPage from '@/pages/chat/ui/ChatPage';
import ReportPage from '@/pages/report/ui/ReportPage';

import NotFoundPage from '@/pages/not-found/ui/NotFoundPage';

const TodoPage = () => <div style={{ padding: 40 }}>TODO</div>;

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth и онбординг */}
        <Route element={<AuthLayout />}>
          <Route path={RoutePaths.LOGIN} element={<AuthPage mode="login" />} />
          <Route path={RoutePaths.REGISTER} element={<AuthPage mode="register" />} />
          <Route path={RoutePaths.AUTH} element={<Navigate to={RoutePaths.LOGIN} />} />
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
        </Route>

        {/* Основное приложение */}
        <Route element={<AppLayout />}>
          <Route path={RoutePaths.LANDING} element={<LandingPage />} />

          <Route
            path={RoutePaths.DISCOVER}
            element={
              <RoleRoute allowedRoles={['user', 'admin']}>
                <DiscoverPage />
              </RoleRoute>
            }
          />
          <Route
            path={RoutePaths.MATCHES}
            element={
              <RoleRoute allowedRoles={['user', 'admin']}>
                <MatchesPage />
              </RoleRoute>
            }
          />
          <Route
            path={RoutePaths.PROFILE}
            element={
              <RoleRoute allowedRoles={['user', 'admin']}>
                <ProfilePage />
              </RoleRoute>
            }
          />
          <Route
            path={RoutePaths.SETTINGS}
            element={
              <RoleRoute allowedRoles={['user', 'admin']}>
                <SettingsPage />
              </RoleRoute>
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
          <Route
            path={`${RoutePaths.CHATS}/:id`}
            element={
              <RoleRoute allowedRoles={['user', 'admin']}>
                <ChatPage />
              </RoleRoute>
            }
          />
          <Route
            path={RoutePaths.REPORT}
            element={
              <RoleRoute allowedRoles={['user', 'admin']}>
                <ReportPage />
              </RoleRoute>
            }
          />
        </Route>

        <Route path={RoutePaths.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
