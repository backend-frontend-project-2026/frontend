import type { User, UserFilters } from '@/entities/user';
import type { DiscoverActionState } from '@/features/discover';
import type {
  BasicInfoFormValue,
  HabitsFormValue,
  InterestsFormValue,
  LivingPreferencesFormValue,
} from '@/features/onboarding';

export type OnboardingDraft = {
  basicInfo: BasicInfoFormValue;
  habits: HabitsFormValue;
  living: LivingPreferencesFormValue;
  interests: InterestsFormValue;
};

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
  updateBasicInfo: (value: BasicInfoFormValue) => void;
  updateHabits: (value: HabitsFormValue) => void;
  updateLiving: (value: LivingPreferencesFormValue) => void;
  updateInterests: (value: InterestsFormValue) => void;
  finishOnboarding: () => void;
  skipOnboarding: () => void;
};

export type FiltersContextValue = {
  activeFilters: UserFilters;
  filtersAreActive: boolean;
  applyCurrentFilters: (nextFilters?: UserFilters) => void;
  resetFilters: () => void;
};

export type DiscoverContextValue = {
  discoverState: DiscoverActionState;
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
