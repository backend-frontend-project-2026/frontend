import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';
import { ProtectedRoute } from '@/app/router/guards/ProtectedRoute';
import { RoleRoute } from '@/app/router/guards/RoleRoute';
import { mockDiscoverUsers } from '@/entities/user';

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
import {
  OnboardingStep1Page,
  OnboardingStep2Page,
  OnboardingStep3Page,
  OnboardingStep4Page,
} from '@/pages/onboarding';

import DiscoverPage from '@/pages/discover/ui/DiscoverPage';
import { FiltersPage } from '@/pages/filters';
import { UserProfilePage } from '@/pages/user-profile';
import MatchesPage from '@/pages/matches/ui/MatchesPage';
import ChatsPage from '@/pages/chats/ui/ChatsPage';
import ProfilePage from '@/pages/profile/ui/ProfilePage';
import SettingsPage from '@/pages/settings/ui/SettingsPage';
import AdminReportsPage from '@/pages/admin/reports/ui/AdminReportsPage';

import NotFoundPage from '@/pages/not-found/ui/NotFoundPage';
import { useRoomieFlow } from '@/app/providers/roomie-flow';

function OnboardingStep1Route() {
  const navigate = useNavigate();
  const { draft, updateBasicInfo, skipOnboarding } = useRoomieFlow();

  return (
    <OnboardingStep1Page
      value={draft.basicInfo}
      onBack={() => {
        skipOnboarding();
        navigate(RoutePaths.DISCOVER);
      }}
      onNext={(value) => {
        updateBasicInfo(value);
        navigate(RoutePaths.ONBOARDING_STEP_2);
      }}
    />
  );
}

function OnboardingStep2Route() {
  const navigate = useNavigate();
  const { draft, updateHabits } = useRoomieFlow();

  return (
    <OnboardingStep2Page
      value={draft.habits}
      onBack={() => navigate(RoutePaths.ONBOARDING_STEP_1)}
      onNext={(value) => {
        updateHabits(value);
        navigate(RoutePaths.ONBOARDING_STEP_3);
      }}
    />
  );
}

function OnboardingStep3Route() {
  const navigate = useNavigate();
  const { draft, updateLiving } = useRoomieFlow();

  return (
    <OnboardingStep3Page
      value={draft.living}
      onBack={() => navigate(RoutePaths.ONBOARDING_STEP_2)}
      onNext={(value) => {
        updateLiving(value);
        navigate(RoutePaths.ONBOARDING_STEP_4);
      }}
    />
  );
}

function OnboardingStep4Route() {
  const navigate = useNavigate();
  const { draft, updateInterests, finishOnboarding } = useRoomieFlow();

  return (
    <OnboardingStep4Page
      value={draft.interests}
      onBack={() => navigate(RoutePaths.ONBOARDING_STEP_3)}
      onComplete={(value) => {
        updateInterests(value);
        finishOnboarding();
        navigate(RoutePaths.DISCOVER);
      }}
    />
  );
}

function DiscoverRoute() {
  const navigate = useNavigate();
  const {
    completed,
    activeFilters,
    availableUsers,
    totalUsersCount,
    matchingUsersCount,
    filtersAreActive,
    applyCurrentFilters,
    resetFilters,
    openProfile,
    handleLike,
    handleSkip,
    handleSuperLike,
  } = useRoomieFlow();

  if (!completed) {
    return <Navigate to={RoutePaths.ONBOARDING_STEP_1} replace />;
  }

  return (
    <DiscoverPage
      users={availableUsers}
      totalUsersCount={totalUsersCount}
      matchingUsersCount={matchingUsersCount}
      hasActiveFilters={filtersAreActive}
      activeFilters={activeFilters}
      onOpenFilters={() => navigate(RoutePaths.FILTERS)}
      onResetFilters={resetFilters}
      onApplyFilters={applyCurrentFilters}
      onOpenProfile={(user) => {
        openProfile(user);
        navigate(RoutePaths.userProfile(user.id));
      }}
      onLike={handleLike}
      onSkip={handleSkip}
      onSuperLike={handleSuperLike}
    />
  );
}

function FiltersRoute() {
  const navigate = useNavigate();
  const { completed, draft, activeFilters, applyCurrentFilters } = useRoomieFlow();

  if (!completed) {
    return <Navigate to={RoutePaths.ONBOARDING_STEP_1} replace />;
  }

  return (
    <FiltersPage
      initialFilters={activeFilters}
      currentUserUniversity={draft.basicInfo.university}
      currentUserLocation={draft.basicInfo.location}
      usersForPreview={mockDiscoverUsers}
      onBack={() => navigate(RoutePaths.DISCOVER)}
      onApply={(filters) => {
        applyCurrentFilters(filters);
        navigate(RoutePaths.DISCOVER);
      }}
    />
  );
}

function UserProfileRoute() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const {
    completed,
    profileUser,
    selectProfileById,
    clearSelectedUser,
    handleLike,
    handleSkip,
    handleSuperLike,
  } = useRoomieFlow();

  React.useEffect(() => {
    selectProfileById(userId);

    return () => {
      clearSelectedUser();
    };
  }, [userId, selectProfileById, clearSelectedUser]);

  if (!completed) {
    return <Navigate to={RoutePaths.ONBOARDING_STEP_1} replace />;
  }

  return (
    <UserProfilePage
      user={profileUser}
      onBack={() => navigate(RoutePaths.DISCOVER)}
      onLike={() => {
        handleLike(profileUser);
        navigate(RoutePaths.DISCOVER);
      }}
      onSkip={() => {
        handleSkip(profileUser);
        navigate(RoutePaths.DISCOVER);
      }}
      onSuperLike={() => {
        handleSuperLike(profileUser);
        navigate(RoutePaths.DISCOVER);
      }}
    />
  );
}

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth и онбординг */}
        <Route element={<AuthLayout />}>
          <Route path={RoutePaths.AUTH} element={<AuthPage />} />
          <Route path={RoutePaths.VERIFY_EMAIL} element={<VerifyEmailPage />} />
          <Route path={RoutePaths.VERIFY_CODE} element={<VerifyCodePage />} />
          <Route path={RoutePaths.SUCCESS} element={<SuccessPage />} />
          <Route path={RoutePaths.ERROR} element={<ErrorPage />} />
          <Route path={RoutePaths.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={RoutePaths.RESET_PASSWORD} element={<ResetPasswordPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route
            path={RoutePaths.ONBOARDING}
            element={<Navigate to={RoutePaths.ONBOARDING_STEP_1} replace />}
          />
          <Route path={RoutePaths.ONBOARDING_STEP_1} element={<OnboardingStep1Route />} />
          <Route path={RoutePaths.ONBOARDING_STEP_2} element={<OnboardingStep2Route />} />
          <Route path={RoutePaths.ONBOARDING_STEP_3} element={<OnboardingStep3Route />} />
          <Route path={RoutePaths.ONBOARDING_STEP_4} element={<OnboardingStep4Route />} />

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
        </Route>

        <Route path={RoutePaths.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
