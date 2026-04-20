import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';
import { ProtectedRoute } from '@/app/router/guards/ProtectedRoute';
import { RoleRoute } from '@/app/router/guards/RoleRoute';
import { MOCK_DISCOVER_USERS } from '@/entities/user';

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
  OnboardingSummaryPage,
  OnboardingSuccessPage,
} from '@/pages/onboarding';

import type {
  BasicInfoFormValue,
  HabitsFormValue,
  InterestsFormValue,
  LivingPreferencesFormValue,
} from '@/features/onboarding';

import {
  isBasicInfoStepComplete,
  isHabitsStepComplete,
  isInterestsStepComplete,
  isLivingStepComplete,
} from '@/features/onboarding';

import DiscoverPage from '@/pages/discover/ui/DiscoverPage';
import { FiltersPage } from '@/pages/filters';
import { UserProfilePage } from '@/pages/user-profile';
import MatchesPage from '@/pages/matches/ui/MatchesPage';
import ProfilePage from '@/pages/profile/ui/ProfilePage';
import SettingsPage from '@/pages/settings/ui/SettingsPage';
import AdminReportsPage from '@/pages/admin/reports/ui/AdminReportsPage';

import ChatPage from '@/pages/chat/ui/ChatPage';
import ReportPage from '@/pages/report/ui/ReportPage';

import NotFoundPage from '@/pages/not-found/ui/NotFoundPage';
import { useRoomieFlow } from '@/app/providers/roomie-flow';

type ResumeDraft = {
  basicInfo: BasicInfoFormValue;
  habits: HabitsFormValue;
  living: LivingPreferencesFormValue;
  interests: InterestsFormValue;
};

function getResumeOnboardingPath(draft: ResumeDraft, currentStep: 1 | 2 | 3 | 4) {
  if (!isBasicInfoStepComplete(draft.basicInfo)) {
    return RoutePaths.ONBOARDING_STEP_1;
  }

  if (currentStep === 1) {
    return RoutePaths.ONBOARDING_STEP_1;
  }

  if (!isHabitsStepComplete(draft.habits)) {
    return RoutePaths.ONBOARDING_STEP_2;
  }

  if (currentStep === 2) {
    return RoutePaths.ONBOARDING_STEP_2;
  }

  if (!isLivingStepComplete(draft.living)) {
    return RoutePaths.ONBOARDING_STEP_3;
  }

  if (currentStep === 3) {
    return RoutePaths.ONBOARDING_STEP_3;
  }

  if (!isInterestsStepComplete(draft.interests)) {
    return RoutePaths.ONBOARDING_STEP_4;
  }

  return RoutePaths.ONBOARDING_SUMMARY;
}

function OnboardingStep1Route() {
  const navigate = useNavigate();
  const { completed, draft, setCurrentStep, updateBasicInfo } = useRoomieFlow();

  React.useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  if (completed) {
    return <Navigate to={RoutePaths.DISCOVER} replace />;
  }

  return (
    <OnboardingStep1Page
      value={draft.basicInfo}
      onChange={updateBasicInfo}
      onNext={(value) => {
        updateBasicInfo(value);
        navigate(RoutePaths.ONBOARDING_STEP_2);
      }}
    />
  );
}

function OnboardingStep2Route() {
  const navigate = useNavigate();
  const { completed, draft, setCurrentStep, updateHabits } = useRoomieFlow();

  React.useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  if (completed) {
    return <Navigate to={RoutePaths.DISCOVER} replace />;
  }

  if (!isBasicInfoStepComplete(draft.basicInfo)) {
    return <Navigate to={RoutePaths.ONBOARDING_STEP_1} replace />;
  }

  return (
    <OnboardingStep2Page
      value={draft.habits}
      onBack={() => navigate(RoutePaths.ONBOARDING_STEP_1)}
      onChange={updateHabits}
      onSkip={() => navigate(RoutePaths.ONBOARDING_STEP_3)}
      onNext={(value) => {
        updateHabits(value);
        navigate(RoutePaths.ONBOARDING_STEP_3);
      }}
    />
  );
}

function OnboardingStep3Route() {
  const navigate = useNavigate();
  const { completed, draft, setCurrentStep, updateLiving } = useRoomieFlow();

  React.useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);

  if (completed) {
    return <Navigate to={RoutePaths.DISCOVER} replace />;
  }

  if (!isBasicInfoStepComplete(draft.basicInfo)) {
    return <Navigate to={RoutePaths.ONBOARDING_STEP_1} replace />;
  }

  return (
    <OnboardingStep3Page
      value={draft.living}
      onBack={() => navigate(RoutePaths.ONBOARDING_STEP_2)}
      onChange={updateLiving}
      onSkip={() => navigate(RoutePaths.ONBOARDING_STEP_4)}
      onNext={(value) => {
        updateLiving(value);
        navigate(RoutePaths.ONBOARDING_STEP_4);
      }}
    />
  );
}

function OnboardingStep4Route() {
  const navigate = useNavigate();
  const { completed, draft, setCurrentStep, updateInterests, finishOnboarding } = useRoomieFlow();

  React.useEffect(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);

  if (completed) {
    return <Navigate to={RoutePaths.DISCOVER} replace />;
  }

  if (!isBasicInfoStepComplete(draft.basicInfo)) {
    return <Navigate to={RoutePaths.ONBOARDING_STEP_1} replace />;
  }

  return (
    <OnboardingStep4Page
      value={draft.interests}
      onBack={() => navigate(RoutePaths.ONBOARDING_STEP_3)}
      onChange={updateInterests}
      onSkip={() => {
        finishOnboarding();
        navigate(RoutePaths.DISCOVER);
      }}
      onComplete={(value) => {
        updateInterests(value);
        navigate(RoutePaths.ONBOARDING_SUMMARY);
      }}
    />
  );
}

function OnboardingSummaryRoute() {
  const navigate = useNavigate();
  const { completed, draft, setCurrentStep, finishOnboarding } = useRoomieFlow();

  React.useEffect(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);

  if (completed) {
    return <Navigate to={RoutePaths.DISCOVER} replace />;
  }

  if (!isBasicInfoStepComplete(draft.basicInfo)) {
    return <Navigate to={RoutePaths.ONBOARDING_STEP_1} replace />;
  }

  if (!isHabitsStepComplete(draft.habits)) {
    return <Navigate to={RoutePaths.ONBOARDING_STEP_2} replace />;
  }

  if (!isLivingStepComplete(draft.living)) {
    return <Navigate to={RoutePaths.ONBOARDING_STEP_3} replace />;
  }

  if (!isInterestsStepComplete(draft.interests)) {
    return <Navigate to={RoutePaths.ONBOARDING_STEP_4} replace />;
  }

  return (
    <OnboardingSummaryPage
      basicInfo={draft.basicInfo}
      habits={draft.habits}
      living={draft.living}
      interests={draft.interests}
      onBack={() => navigate(RoutePaths.ONBOARDING_STEP_4)}
      onEditBasicInfo={() => navigate(RoutePaths.ONBOARDING_STEP_1)}
      onEditHabits={() => navigate(RoutePaths.ONBOARDING_STEP_2)}
      onEditLiving={() => navigate(RoutePaths.ONBOARDING_STEP_3)}
      onEditInterests={() => navigate(RoutePaths.ONBOARDING_STEP_4)}
      onComplete={() => {
        finishOnboarding();
        navigate(RoutePaths.ONBOARDING_SUCCESS);
      }}
    />
  );
}

function OnboardingSuccessRoute() {
  const navigate = useNavigate();
  const { completed, draft, currentStep } = useRoomieFlow();

  if (!completed) {
    return <Navigate to={getResumeOnboardingPath(draft, currentStep)} replace />;
  }

  return (
    <OnboardingSuccessPage onContinue={() => navigate(RoutePaths.DISCOVER, { replace: true })} />
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
    clearSkippedProfiles,
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
      onResetFilters={() => {
        clearSkippedProfiles();
        resetFilters();
      }}
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
  const { completed, draft, activeFilters, applyCurrentFilters, clearSkippedProfiles } =
    useRoomieFlow();

  if (!completed) {
    return <Navigate to={RoutePaths.ONBOARDING_STEP_1} replace />;
  }

  return (
    <FiltersPage
      initialFilters={activeFilters}
      currentUserUniversity={draft.basicInfo.university}
      currentUserLocation={draft.basicInfo.location}
      usersForPreview={MOCK_DISCOVER_USERS}
      onBack={() => navigate(RoutePaths.DISCOVER)}
      onApply={(filters) => {
        clearSkippedProfiles();
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

  if (!profileUser) {
    return <NotFoundPage />;
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
function OnboardingEntryRoute() {
  const { completed, draft, currentStep } = useRoomieFlow();

  if (completed) {
    return <Navigate to={RoutePaths.DISCOVER} replace />;
  }

  return <Navigate to={getResumeOnboardingPath(draft, currentStep)} replace />;
}

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
