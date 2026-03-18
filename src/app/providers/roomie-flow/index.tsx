import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { mockDetailedUser, mockDiscoverUsers, type User, type UserFilters } from '@/entities/user';
import {
  applyFiltersToUsers,
  createEmptyDiscoverFilters,
  hasActiveFilters,
  initialDiscoverActionState,
  likeProfile,
  skipProfile,
  superLikeProfile,
  type DiscoverActionState,
} from '@/features/discover';
import type {
  BasicInfoFormValue,
  HabitsFormValue,
  InterestsFormValue,
  LivingPreferencesFormValue,
} from '@/features/onboarding';

type OnboardingDraft = {
  basicInfo: BasicInfoFormValue;
  habits: HabitsFormValue;
  living: LivingPreferencesFormValue;
  interests: InterestsFormValue;
};

type RoomieFlowContextValue = {
  completed: boolean;
  draft: OnboardingDraft;
  activeFilters: UserFilters;
  discoverState: DiscoverActionState;
  filteredUsers: User[];
  availableUsers: User[];
  currentDiscoverUser: User | null;
  profileUser: User;
  filtersAreActive: boolean;
  totalUsersCount: number;
  matchingUsersCount: number;

  updateBasicInfo: (value: BasicInfoFormValue) => void;
  updateHabits: (value: HabitsFormValue) => void;
  updateLiving: (value: LivingPreferencesFormValue) => void;
  updateInterests: (value: InterestsFormValue) => void;

  finishOnboarding: () => void;
  skipOnboarding: () => void;

  applyCurrentFilters: (nextFilters?: UserFilters) => void;
  resetFilters: () => void;

  openProfile: (user: User) => void;
  selectProfileById: (userId?: string) => void;
  clearSelectedUser: () => void;

  handleLike: (user: User) => void;
  handleSkip: (user: User) => void;
  handleSuperLike: (user: User) => void;
};

const RoomieFlowContext = createContext<RoomieFlowContextValue | null>(null);

const initialDraft: OnboardingDraft = {
  basicInfo: {
    name: '',
    age: '',
    gender: '',
    university: '',
    faculty: '',
    course: '',
    location: '',
    bio: '',
    avatar: '',
    photos: [],
  },
  habits: {
    sleepSchedule: '',
    cleanliness: '',
    noiseLevel: '',
    guestFrequency: '',
    smokingPreference: '',
    alcoholPreference: '',
    roomOrderPreference: '',
    petPreference: '',
    hasQuietHours: true,
    quietFrom: '',
    quietTo: '',
    isSmokingAllowed: false,
    hasPets: false,
  },
  living: {
    budgetMin: '',
    budgetMax: '',
    moveInDate: '',
    stayDuration: '',
    housingType: '',
    livingNotes: '',
    idealRoommateDescription: '',
    rentalCriteria: '',
  },
  interests: {
    interests: [],
    compatibilityNote: '',
  },
};

export function RoomieFlowProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState<OnboardingDraft>(initialDraft);
  const [completed, setCompleted] = useState(false);
  const [discoverState, setDiscoverState] = useState<DiscoverActionState>(
    initialDiscoverActionState
  );
  const [activeFilters, setActiveFilters] = useState<UserFilters>(createEmptyDiscoverFilters());
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = useMemo(
    () => applyFiltersToUsers(mockDiscoverUsers, activeFilters),
    [activeFilters]
  );

  const availableUsers = useMemo(
    () => filteredUsers.filter((user) => !discoverState.dismissedUserIds.includes(user.id)),
    [discoverState.dismissedUserIds, filteredUsers]
  );

  const currentDiscoverUser = availableUsers[0] ?? null;
  const filtersAreActive = hasActiveFilters(activeFilters);
  const profileUser = selectedUser ?? currentDiscoverUser ?? mockDetailedUser;

  const updateBasicInfo = useCallback((value: BasicInfoFormValue) => {
    setDraft((current) => ({ ...current, basicInfo: value }));
  }, []);

  const updateHabits = useCallback((value: HabitsFormValue) => {
    setDraft((current) => ({ ...current, habits: value }));
  }, []);

  const updateLiving = useCallback((value: LivingPreferencesFormValue) => {
    setDraft((current) => ({ ...current, living: value }));
  }, []);

  const updateInterests = useCallback((value: InterestsFormValue) => {
    setDraft((current) => ({ ...current, interests: value }));
  }, []);

  const finishOnboarding = useCallback(() => {
    setCompleted(true);
    setSelectedUser(null);
  }, []);

  const skipOnboarding = useCallback(() => {
    setCompleted(true);
    setSelectedUser(null);
  }, []);

  const applyCurrentFilters = useCallback((nextFilters?: UserFilters) => {
    if (nextFilters) {
      setActiveFilters(nextFilters);
    }

    setSelectedUser(null);
    setDiscoverState((currentState) => ({
      ...currentState,
      dismissedUserIds: currentState.dismissedUserIds.filter(
        (id) =>
          currentState.likedUserIds.includes(id) || currentState.superLikedUserIds.includes(id)
      ),
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedUser(null);
    setActiveFilters(createEmptyDiscoverFilters());
    setDiscoverState((currentState) => ({
      ...currentState,
      dismissedUserIds: currentState.dismissedUserIds.filter(
        (id) =>
          currentState.likedUserIds.includes(id) || currentState.superLikedUserIds.includes(id)
      ),
    }));
  }, []);

  const openProfile = useCallback((user: User) => {
    setSelectedUser(user.id === mockDetailedUser.id ? mockDetailedUser : user);
  }, []);

  const selectProfileById = useCallback(
    (userId?: string) => {
      if (!userId) {
        setSelectedUser(currentDiscoverUser ?? mockDetailedUser);
        return;
      }

      const foundUser = mockDiscoverUsers.find((user) => user.id === userId);

      if (!foundUser) {
        setSelectedUser(currentDiscoverUser ?? mockDetailedUser);
        return;
      }

      setSelectedUser(foundUser.id === mockDetailedUser.id ? mockDetailedUser : foundUser);
    },
    [currentDiscoverUser]
  );

  const clearSelectedUser = useCallback(() => {
    setSelectedUser(null);
  }, []);

  const handleLike = useCallback((user: User) => {
    setDiscoverState((currentState) => likeProfile(user, currentState));
  }, []);

  const handleSkip = useCallback((user: User) => {
    setDiscoverState((currentState) => skipProfile(user, currentState));
  }, []);

  const handleSuperLike = useCallback((user: User) => {
    setDiscoverState((currentState) => superLikeProfile(user, currentState));
  }, []);

  const value = useMemo<RoomieFlowContextValue>(
    () => ({
      completed,
      draft,
      activeFilters,
      discoverState,
      filteredUsers,
      availableUsers,
      currentDiscoverUser,
      profileUser,
      filtersAreActive,
      totalUsersCount: mockDiscoverUsers.length,
      matchingUsersCount: filteredUsers.length,

      updateBasicInfo,
      updateHabits,
      updateLiving,
      updateInterests,

      finishOnboarding,
      skipOnboarding,

      applyCurrentFilters,
      resetFilters,

      openProfile,
      selectProfileById,
      clearSelectedUser,

      handleLike,
      handleSkip,
      handleSuperLike,
    }),
    [
      completed,
      draft,
      activeFilters,
      discoverState,
      filteredUsers,
      availableUsers,
      currentDiscoverUser,
      profileUser,
      filtersAreActive,
      updateBasicInfo,
      updateHabits,
      updateLiving,
      updateInterests,
      finishOnboarding,
      skipOnboarding,
      applyCurrentFilters,
      resetFilters,
      openProfile,
      selectProfileById,
      clearSelectedUser,
      handleLike,
      handleSkip,
      handleSuperLike,
    ]
  );

  return <RoomieFlowContext.Provider value={value}>{children}</RoomieFlowContext.Provider>;
}

export function useRoomieFlow() {
  const context = useContext(RoomieFlowContext);

  if (!context) {
    throw new Error('useRoomieFlow must be used inside RoomieFlowProvider');
  }

  return context;
}
