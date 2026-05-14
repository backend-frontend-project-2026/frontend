import { lazy, Suspense } from 'react';
import { Spin } from 'antd';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import { UserProfileRoute } from '@/app/router/routes/UserProfileRoutes';

import AuthLayout from '@/app/layouts/AuthLayout/AuthLayout';
import AppLayout from '@/app/layouts/AppLayout/AppLayout';
import MainLayout from '@/app/layouts/MainLayout/MainLayout';

const DiscoverRoute = lazy(() =>
  import('@/app/router/routes/DiscoverRoutes').then((module) => ({
    default: module.DiscoverRoute,
  }))
);

const FiltersRoute = lazy(() =>
  import('@/app/router/routes/DiscoverRoutes').then((module) => ({
    default: module.FiltersRoute,
  }))
);

const ChatPage = lazy(() => import('@/pages/chat/ui/ChatPage'));

const LandingPage = lazy(() => import('@/pages/landing/ui/LandingPage'));

const AuthPage = lazy(() => import('@/pages/auth/ui/AuthPage'));
const VerifyEmailPage = lazy(() => import('@/pages/auth/verify-email/ui/VerifyEmailPage'));
const VerifyCodePage = lazy(() => import('@/pages/auth/verify-code/ui/VerifyCodePage'));
const SuccessPage = lazy(() => import('@/pages/auth/success/ui/SuccessPage'));
const ErrorPage = lazy(() => import('@/pages/auth/error/ui/ErrorPage'));
const ForgotPasswordPage = lazy(() =>
  import('@/pages/auth/forgot-password/ui/ForgotPasswordPage')
);
const ResetPasswordPage = lazy(() =>
  import('@/pages/auth/reset-password/ui/ResetPasswordPage')
);

const MatchesPage = lazy(() => import('@/pages/matches/ui/MatchesPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ui/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/settings/ui/SettingsPage'));
const AdminReportsPage = lazy(() => import('@/pages/admin/reports/ui/AdminReportsPage'));
const ReportPage = lazy(() => import('@/pages/report/ui/ReportPage'));

const NotFoundPage = lazy(() => import('@/pages/not-found/ui/NotFoundPage'));

const RouteLoadingFallback = () => (
  <div style={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
    <Spin size="large" />
  </div>
);

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoadingFallback />}>
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
          <Route
            element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path={RoutePaths.ONBOARDING} element={<OnboardingEntryRoute />} />
            <Route path={RoutePaths.ONBOARDING_STEP_1} element={<OnboardingStep1Route />} />
            <Route path={RoutePaths.ONBOARDING_STEP_2} element={<OnboardingStep2Route />} />
            <Route path={RoutePaths.ONBOARDING_STEP_3} element={<OnboardingStep3Route />} />
            <Route path={RoutePaths.ONBOARDING_STEP_4} element={<OnboardingStep4Route />} />
            <Route path={RoutePaths.ONBOARDING_SUMMARY} element={<OnboardingSummaryRoute />} />
            <Route path={RoutePaths.ONBOARDING_SUCCESS} element={<OnboardingSuccessRoute />} />
          </Route>

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
        </Route>

        <Route path={RoutePaths.NOT_FOUND} element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};