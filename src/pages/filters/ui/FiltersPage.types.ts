import type { FilterParams, User } from '../../../entities/user';
import type {
  AlcoholValue,
  DesktopNoiseValue,
  DesktopPetsValue,
  DesktopSmokingValue,
  MobileNoiseValue,
  RoomOrderValue,
  SleepScheduleValue,
  StayDurationValue,
} from '../lib/types';

export type ChipOption<T extends string> = {
  value: T;
  label: string;
};

export type NonEmptyValue<T> = Exclude<T, ''>;

export type FiltersPageProps = {
  initialFilters?: FilterParams;
  currentUserUniversity?: string;
  currentUserLocation?: string;
  usersForPreview?: User[];
  onBack?: () => void;
  onApply?: (filters: FilterParams) => void;
};

export type FiltersFormState = {
  onlyDormitory: boolean;
  onlyRental: boolean;
  petsAllowedMobile: boolean;
  noSmokingMobile: boolean;
  femaleOnly: boolean;
  maleOnly: boolean;
  mobileNoise: MobileNoiseValue;
  desktopSmoking: DesktopSmokingValue;
  desktopNoise: DesktopNoiseValue;
  desktopPets: DesktopPetsValue;
  budgetMin: string;
  budgetMax: string;
  ageMin: string;
  ageMax: string;
  moveInDate: string;
  stayDuration: StayDurationValue;
  university: string;
  district: string;
  location: string;
  faculty: string;
  course: string;
  rentalCriteria: string;
  sameUniversityOnly: boolean;
  sameLocationOnly: boolean;
  sleepSchedule: SleepScheduleValue;
  quietOnly: boolean;
  alcoholPreference: AlcoholValue;
  roomOrderPreference: RoomOrderValue;
};

export type UpdateFiltersForm = (
  updater: Partial<FiltersFormState> | ((current: FiltersFormState) => Partial<FiltersFormState>)
) => void;

export type SetFilterField = <K extends keyof FiltersFormState>(
  key: K,
  value: FiltersFormState[K]
) => void;

export type PreviewStateProps = {
  showNoPreviewData: boolean;
  showEmptyPreview: boolean;
  showIdlePreview: boolean;
  previewCount: number;
};

export type FilterActionsProps = {
  resetAll: () => void;
  applyFilters: () => void;
};
