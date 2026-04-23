import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';
import { ProtectedRoute } from '@/app/router/guards/ProtectedRoute';
import { RoleRoute } from '@/app/router/guards/RoleRoute';
import {
  OnboardingEntryRoute,
  OnboardingStep1Route,
  OnboardingStep2Route,
  OnboardingStep3Route,
  OnboardingStep4Route,
  OnboardingSummaryRoute,
  OnboardingSuccessRoute,
} from '@/app/router/routes/OnboardingRoutes';
import { DiscoverRoute, FiltersRoute } from '@/app/router/routes/DiscoverRoutes';
import { UserProfileRoute } from '@/app/router/routes/UserProfileRoutes';

import AuthLayout from '@/app/layouts/AuthLayout/AuthLayout';
import AppLayout from '@/app/layouts/AppLayout/AppLayout';
import MainLayout from '@/app/layouts/MainLayout/MainLayout';

import LandingPage from '@/pages/landing/ui/LandingPage';

import AuthPage from '@/pages/auth/ui/AuthPage';
import VerifyEmailPage from '@/pages/auth/verify-email/ui/VerifyEmailPage';
import VerifyCodePage from '@/pages/auth/verify-code/ui/VerifyCodePage';
import SuccessPage from '@/pages/auth/success/ui/SuccessPage';
import ErrorPage from '@/pages/auth/error/ui/ErrorPage';
import ForgotPasswordPage from '@/pages/auth/forgot-password/ui/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/reset-password/ui/ResetPasswordPage';

import UserProfileStatusPage from '@/pages/user-profile/ui/UserProfileStatusPage';
import MatchesPage from '@/pages/matches/ui/MatchesPage';
import ProfilePage from '@/pages/profile/ui/ProfilePage';
import SettingsPage from '@/pages/settings/ui/SettingsPage';
import AdminReportsPage from '@/pages/admin/reports/ui/AdminReportsPage';

import ChatPage from '@/pages/chat/ui/ChatPage';
import ReportPage from '@/pages/report/ui/ReportPage';

import NotFoundPage from '@/pages/not-found/ui/NotFoundPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth и онбординг */}
        <Route element={<AuthLayout />}>
          <Route path={RoutePaths.AUTH} element={<Navigate to={RoutePaths.LOGIN} replace />} />
          <Route path={RoutePaths.LOGIN} element={<AuthPage mode="login" />} />
          <Route path={RoutePaths.REGISTER} element={<AuthPage mode="register" />} />
          <Route path={RoutePaths.VERIFY_EMAIL} element={<VerifyEmailPage />} />
          <Route path={RoutePaths.VERIFY_CODE} element={<VerifyCodePage />} />
          <Route path={RoutePaths.SUCCESS} element={<SuccessPage />} />
          <Route path={RoutePaths.ERROR} element={<ErrorPage />} />
          <Route path={RoutePaths.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={RoutePaths.RESET_PASSWORD} element={<ResetPasswordPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path={RoutePaths.ONBOARDING} element={<OnboardingEntryRoute />} />
          <Route path={RoutePaths.ONBOARDING_STEP_1} element={<OnboardingStep1Route />} />
          <Route path={RoutePaths.ONBOARDING_STEP_2} element={<OnboardingStep2Route />} />
          <Route path={RoutePaths.ONBOARDING_STEP_3} element={<OnboardingStep3Route />} />
          <Route path={RoutePaths.ONBOARDING_STEP_4} element={<OnboardingStep4Route />} />
          <Route path={RoutePaths.ONBOARDING_SUMMARY} element={<OnboardingSummaryRoute />} />
          <Route path={RoutePaths.ONBOARDING_SUCCESS} element={<OnboardingSuccessRoute />} />

          <Route
            path={RoutePaths.DISCOVER}
            element={
              <ProtectedRoute>
                <DiscoverRoute />
              </ProtectedRoute>
            }
          />

          <Route
            path={RoutePaths.FILTERS}
            element={
              <ProtectedRoute>
                <FiltersRoute />
              </ProtectedRoute>
            }
          />

          <Route
            path={RoutePaths.USER_PROFILE_BASE}
            element={
              <ProtectedRoute>
                <UserProfileStatusPage variant="error" />
              </ProtectedRoute>
            }
          />

          <Route
            path={`${RoutePaths.USER_PROFILE_BASE}/:userId`}
            element={
              <ProtectedRoute>
                <UserProfileRoute />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Основное приложение */}
        <Route element={<AppLayout />}>
          <Route path={RoutePaths.LANDING} element={<LandingPage />} />
          <Route
            path={RoutePaths.MATCHES}
            element={
              <ProtectedRoute>
                <MatchesPage />
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

          <Route
            path={RoutePaths.CHATS}
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={`${RoutePaths.CHATS}/:id`}
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={`${RoutePaths.REPORT}/:userId`}
            element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={RoutePaths.REPORT}
            element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path={RoutePaths.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
