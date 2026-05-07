import type { FilterParams, OnboardingForm, User } from '@/entities/user';
import type { DiscoverActionState } from '@/features/discover';

export type OnboardingDraft = OnboardingForm;

export type OnboardingStep = 1 | 2 | 3 | 4;

export type OnboardingStatus = 'in_progress' | 'skipped' | 'completed';

export type PersistedOnboardingState = {
  status: OnboardingStatus;
  currentStep: OnboardingStep;
  draft: OnboardingDraft;
};

export type OnboardingContextValue = {
  status: OnboardingStatus;
  completed: boolean;
  currentStep: OnboardingStep;
  draft: OnboardingDraft;
  setCurrentStep: (step: OnboardingStep) => void;
  replaceDraft: (value: OnboardingDraft) => void;
  updateBasicInfo: (value: OnboardingForm['basicInfo']) => void;
  updateHabits: (value: OnboardingForm['habits']) => void;
  updateLiving: (value: OnboardingForm['living']) => void;
  updateInterests: (value: OnboardingForm['interests']) => void;
  finishOnboarding: () => void;
  skipOnboarding: () => void;
};

export type FiltersContextValue = {
  activeFilters: FilterParams;
  filtersAreActive: boolean;
  applyCurrentFilters: (nextFilters?: FilterParams) => void;
  resetFilters: () => void;
};

export type DiscoverContextValue = {
  discoverState: DiscoverActionState;
  discoverUsers: User[];
  filteredUsers: User[];
  availableUsers: User[];
  currentDiscoverUser: User | null;
  totalUsersCount: number;
  matchingUsersCount: number;
  handleLike: (user: User) => void;
  handleSkip: (user: User) => void;
  handleSuperLike: (user: User) => void;
  clearSkippedProfiles: () => void;
};

export type ProfileContextValue = {
  profileUser: User | null;
  openProfile: (user: User) => void;
  selectProfileById: (userId?: string) => void;
  clearSelectedUser: () => void;
};

export type RoomieFlowContextValue = OnboardingContextValue &
  FiltersContextValue &
  DiscoverContextValue &
  ProfileContextValue;
