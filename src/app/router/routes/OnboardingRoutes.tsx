import { useEffect, useState } from 'react';
import { message } from 'antd';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';
import { withEditMode } from '@/shared/utils/route';
import { useRoomieFlow } from '@/app/providers/roomie-flow';
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
  saveOnboardingProfile,
} from '@/features/onboarding';

const ONBOARDING_SAVE_ERROR_MESSAGE =
  'Не удалось сохранить анкету на сервере. Возможна ошибка в вузе или факультете.';

type ResumeDraft = {
  basicInfo: BasicInfoFormValue;
  habits: HabitsFormValue;
  living: LivingPreferencesFormValue;
  interests: InterestsFormValue;
};

function useIsProfileEditMode() {
  const [searchParams] = useSearchParams();
  return searchParams.get('mode') === 'edit';
}

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

export function OnboardingStep1Route() {
  const navigate = useNavigate();
  const isEditMode = useIsProfileEditMode();
  const { completed, draft, setCurrentStep, updateBasicInfo } = useRoomieFlow();

  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  if (completed && !isEditMode) {
    return <Navigate to={RoutePaths.DISCOVER} replace />;
  }

  return (
    <OnboardingStep1Page
      value={draft.basicInfo}
      onBack={isEditMode ? () => navigate(RoutePaths.PROFILE) : undefined}
      onChange={updateBasicInfo}
      onNext={(value) => {
        updateBasicInfo(value);
        navigate(withEditMode(RoutePaths.ONBOARDING_STEP_2, isEditMode));
      }}
    />
  );
}

export function OnboardingStep2Route() {
  const navigate = useNavigate();
  const isEditMode = useIsProfileEditMode();
  const { completed, draft, setCurrentStep, updateHabits } = useRoomieFlow();

  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  if (completed && !isEditMode) {
    return <Navigate to={RoutePaths.DISCOVER} replace />;
  }

  if (!isBasicInfoStepComplete(draft.basicInfo)) {
    return (
      <Navigate
        to={withEditMode(RoutePaths.ONBOARDING_STEP_1, isEditMode)}
        replace
      />
    );
  }

  return (
    <OnboardingStep2Page
      value={draft.habits}
      onBack={() =>
        navigate(withEditMode(RoutePaths.ONBOARDING_STEP_1, isEditMode))
      }
      onChange={updateHabits}
      onSkip={() =>
        navigate(withEditMode(RoutePaths.ONBOARDING_STEP_3, isEditMode))
      }
      onNext={(value) => {
        updateHabits(value);
        navigate(withEditMode(RoutePaths.ONBOARDING_STEP_3, isEditMode))
      }}
    />
  );
}

export function OnboardingStep3Route() {
  const navigate = useNavigate();
  const isEditMode = useIsProfileEditMode();
  const { completed, draft, setCurrentStep, updateLiving } = useRoomieFlow();

  useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);

  if (completed && !isEditMode) {
    return <Navigate to={RoutePaths.DISCOVER} replace />;
  }

  if (!isBasicInfoStepComplete(draft.basicInfo)) {
    return (
      <Navigate
        to={withEditMode(RoutePaths.ONBOARDING_STEP_1, isEditMode)}
        replace
      />
    );
  }

  return (
    <OnboardingStep3Page
      value={draft.living}
      onBack={() =>
        navigate(withEditMode(RoutePaths.ONBOARDING_STEP_2, isEditMode))
      }
      onChange={updateLiving}
      onSkip={() =>
        navigate(withEditMode(RoutePaths.ONBOARDING_STEP_4, isEditMode))
      }
      onNext={(value) => {
        updateLiving(value);
        navigate(withEditMode(RoutePaths.ONBOARDING_STEP_4, isEditMode))
      }}
    />
  );
}

export function OnboardingStep4Route() {
  const navigate = useNavigate();
  const isEditMode = useIsProfileEditMode();
  const [isCompleting, setIsCompleting] = useState(false);
  const { completed, draft, setCurrentStep, updateInterests, finishOnboarding } = useRoomieFlow();

  useEffect(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);

  const handleFinishOnboarding = async () => {
    if (isCompleting) {
      return;
    }

    try {
      setIsCompleting(true);
      await saveOnboardingProfile(draft);
      finishOnboarding();
      navigate(isEditMode ? RoutePaths.PROFILE : RoutePaths.DISCOVER);
    } catch {
      message.error(ONBOARDING_SAVE_ERROR_MESSAGE);
    } finally {
      setIsCompleting(false);
    }
  };

  if (completed && !isEditMode) {
    return <Navigate to={RoutePaths.DISCOVER} replace />;
  }

  if (!isBasicInfoStepComplete(draft.basicInfo)) {
    return (
      <Navigate
        to={withEditMode(RoutePaths.ONBOARDING_STEP_1, isEditMode)}
        replace
      />
    );
  }

  return (
    <OnboardingStep4Page
      value={draft.interests}
      onBack={() =>
        navigate(withEditMode(RoutePaths.ONBOARDING_STEP_3, isEditMode))
      }
      onChange={updateInterests}
      onSkip={() => {
        void handleFinishOnboarding();
      }}
      onComplete={(value) => {
        updateInterests(value);
        navigate(withEditMode(RoutePaths.ONBOARDING_SUMMARY, isEditMode));
      }}
    />
  );
}

export function OnboardingSummaryRoute() {
  const navigate = useNavigate();
  const isEditMode = useIsProfileEditMode();
  const [isCompleting, setIsCompleting] = useState(false);
  const { completed, draft, setCurrentStep, finishOnboarding } = useRoomieFlow();

  useEffect(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);

  if (completed && !isEditMode) {
    return <Navigate to={RoutePaths.DISCOVER} replace />;
  }

  if (!isBasicInfoStepComplete(draft.basicInfo)) {
    return (
      <Navigate
        to={withEditMode(RoutePaths.ONBOARDING_STEP_1, isEditMode)}
        replace
      />
    );
  }

  if (!isHabitsStepComplete(draft.habits)) {
    return (
      <Navigate
        to={withEditMode(RoutePaths.ONBOARDING_STEP_2, isEditMode)}
        replace
      />
    );
  }

  if (!isLivingStepComplete(draft.living)) {
    return (
      <Navigate
        to={withEditMode(RoutePaths.ONBOARDING_STEP_3, isEditMode)}
        replace
      />
    );
  }

  if (!isInterestsStepComplete(draft.interests)) {
    return (
      <Navigate
        to={withEditMode(RoutePaths.ONBOARDING_STEP_4, isEditMode)}
        replace
      />
    );
  }

  const handleComplete = async () => {
    if (isCompleting) {
      return;
    }

    try {
      setIsCompleting(true);
      await saveOnboardingProfile(draft);
      finishOnboarding();
      navigate(isEditMode ? RoutePaths.PROFILE : RoutePaths.ONBOARDING_SUCCESS);
    } catch {
      message.error(ONBOARDING_SAVE_ERROR_MESSAGE);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <OnboardingSummaryPage
      basicInfo={draft.basicInfo}
      habits={draft.habits}
      living={draft.living}
      interests={draft.interests}
      onBack={() =>
        navigate(withEditMode(RoutePaths.ONBOARDING_STEP_4, isEditMode))
      }
      onEditBasicInfo={() =>
        navigate(withEditMode(RoutePaths.ONBOARDING_STEP_1, isEditMode))
      }
      onEditHabits={() =>
        navigate(withEditMode(RoutePaths.ONBOARDING_STEP_2, isEditMode))
      }
      onEditLiving={() =>
        navigate(withEditMode(RoutePaths.ONBOARDING_STEP_3, isEditMode))
      }
      onEditInterests={() =>
        navigate(withEditMode(RoutePaths.ONBOARDING_STEP_4, isEditMode))
      }
      onComplete={handleComplete}
      isCompleting={isCompleting}
    />
  );
}

export function OnboardingSuccessRoute() {
  const navigate = useNavigate();
  const { completed, draft, currentStep } = useRoomieFlow();

  if (!completed) {
    return <Navigate to={getResumeOnboardingPath(draft, currentStep)} replace />;
  }

  return (
    <OnboardingSuccessPage onContinue={() => navigate(RoutePaths.DISCOVER, { replace: true })} />
  );
}

export function OnboardingEntryRoute() {
  const { completed, draft, currentStep } = useRoomieFlow();

  if (completed) {
    return <Navigate to={RoutePaths.DISCOVER} replace />;
  }

  return <Navigate to={getResumeOnboardingPath(draft, currentStep)} replace />;
}