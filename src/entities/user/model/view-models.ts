import type { User } from './types';

export type DiscoverCard = Pick<
  User,
  'id' | 'name' | 'age' | 'university' | 'faculty' | 'district' | 'bio' | 'avatar' | 'photos'
> & {
  habits: Pick<
    User['habits'],
    'noiseLevel' | 'smokingPreference' | 'cleanliness' | 'guestFrequency'
  >;
};

export function mapUserToDiscoverCard(user: User): DiscoverCard {
  return {
    id: user.id,
    name: user.name,
    age: user.age,
    university: user.university,
    faculty: user.faculty,
    district: user.district,
    bio: user.bio,
    avatar: user.avatar,
    photos: user.photos,
    habits: {
      noiseLevel: user.habits.noiseLevel,
      smokingPreference: user.habits.smokingPreference,
      cleanliness: user.habits.cleanliness,
      guestFrequency: user.habits.guestFrequency,
    },
  };
}

export type FullProfile = Pick<
  User,
  | 'id'
  | 'name'
  | 'age'
  | 'gender'
  | 'university'
  | 'faculty'
  | 'course'
  | 'location'
  | 'district'
  | 'bio'
  | 'interests'
  | 'moveInDate'
  | 'stayDuration'
  | 'idealRoommateDescription'
  | 'rentalCriteria'
  | 'avatar'
  | 'photos'
  | 'hasQuietHours'
> & {
  budget: Pick<User['budget'], 'min' | 'max'>;
  habits: Pick<
    User['habits'],
    | 'noiseLevel'
    | 'smokingPreference'
    | 'alcoholPreference'
    | 'roomOrderPreference'
    | 'cleanliness'
    | 'guestFrequency'
    | 'quietTime'
  >;
};

export function mapUserToFullProfile(user: User): FullProfile {
  return {
    id: user.id,
    name: user.name,
    age: user.age,
    gender: user.gender,
    university: user.university,
    faculty: user.faculty,
    course: user.course,
    location: user.location,
    district: user.district,
    bio: user.bio,
    interests: user.interests,
    moveInDate: user.moveInDate,
    stayDuration: user.stayDuration,
    idealRoommateDescription: user.idealRoommateDescription,
    rentalCriteria: user.rentalCriteria,
    avatar: user.avatar,
    photos: user.photos,
    hasQuietHours: user.hasQuietHours,
    budget: {
      min: user.budget.min,
      max: user.budget.max,
    },
    habits: {
      noiseLevel: user.habits.noiseLevel,
      smokingPreference: user.habits.smokingPreference,
      alcoholPreference: user.habits.alcoholPreference,
      roomOrderPreference: user.habits.roomOrderPreference,
      cleanliness: user.habits.cleanliness,
      guestFrequency: user.habits.guestFrequency,
      quietTime: user.habits.quietTime,
    },
  };
}
export type OnboardingForm = {
  basicInfo: {
    name: string;
    age: string;
    gender: User['gender'] | '';
    university: string;
    faculty: string;
    course: string;
    location: string;
    bio: string;
    avatar: string;
    photos: string[];
  };
  habits: {
    sleepSchedule: User['habits']['sleepSchedule'] | '';
    cleanliness: User['habits']['cleanliness'] | '';
    noiseLevel: User['habits']['noiseLevel'] | '';
    guestFrequency: User['habits']['guestFrequency'] | '';
    smokingPreference: User['habits']['smokingPreference'] | '';
    alcoholPreference: User['habits']['alcoholPreference'] | '';
    roomOrderPreference: User['habits']['roomOrderPreference'] | '';
    petPreference: User['habits']['petPreference'] | '';
    hasQuietHours: boolean;
    quietFrom: string;
    quietTo: string;
    quietIntervalDraft: string;
    isSmokingAllowed: boolean;
    hasPets: boolean;
  };
  living: {
    budgetMin: string;
    budgetMax: string;
    moveInDate: string;
    stayDuration: User['stayDuration'] | '';
    housingType: User['housingType'] | '';
    livingNotes: string;
    idealRoommateDescription: string;
    rentalCriteria: string;
  };
  interests: {
    interests: string[];
    compatibilityNote: string;
    customTagDraft: string;
  };
};

export function mapUserToOnboardingForm(user: User): OnboardingForm {
  return {
    basicInfo: {
      name: user.name,
      age: String(user.age),
      gender: user.gender,
      university: user.university,
      faculty: user.faculty,
      course: user.course,
      location: user.location,
      bio: user.bio,
      avatar: user.avatar,
      photos: user.photos,
    },
    habits: {
      sleepSchedule: user.habits.sleepSchedule,
      cleanliness: user.habits.cleanliness,
      noiseLevel: user.habits.noiseLevel,
      guestFrequency: user.habits.guestFrequency,
      smokingPreference: user.habits.smokingPreference,
      alcoholPreference: user.habits.alcoholPreference,
      roomOrderPreference: user.habits.roomOrderPreference,
      petPreference: user.habits.petPreference,
      hasQuietHours: user.hasQuietHours,
      quietFrom: user.habits.quietTime?.from ?? '',
      quietTo: user.habits.quietTime?.to ?? '',
      quietIntervalDraft:
        user.habits.quietTime?.from && user.habits.quietTime?.to
          ? `${user.habits.quietTime.from} — ${user.habits.quietTime.to}`
          : '',
      isSmokingAllowed: user.isSmokingAllowed,
      hasPets: user.hasPets,
    },
    living: {
      budgetMin: String(user.budget.min),
      budgetMax: String(user.budget.max),
      moveInDate: user.moveInDate,
      stayDuration: user.stayDuration,
      housingType: user.housingType,
      livingNotes: '',
      idealRoommateDescription: user.idealRoommateDescription,
      rentalCriteria: user.rentalCriteria,
    },
    interests: {
      interests: user.interests,
      compatibilityNote: user.compatibilityNote ?? '',
      customTagDraft: '',
    },
  };
}

export type FilterParams = {
  search?: string;
  ageMin?: number;
  ageMax?: number;
  faculty?: string;
  course?: string;
  university?: string;
  district?: string;
  location?: string;
  budgetMin?: number;
  budgetMax?: number;
  moveInDate?: string;
  stayDuration?: User['stayDuration'] | 'any';
  smokingPreference?: User['habits']['smokingPreference'] | 'any';
  alcoholPreference?: User['habits']['alcoholPreference'] | 'any';
  petPreference?: User['habits']['petPreference'] | 'any';
  quietOnly?: boolean;
  roomOrderPreference?: User['habits']['roomOrderPreference'] | 'any';
  rentalCriteria?: string;
  interests?: string[];
  housingType?: User['housingType'] | 'any';
  gender?: User['gender'] | 'any';
  noiseLevel?: User['habits']['noiseLevel'] | 'any';
  sleepSchedule?: User['habits']['sleepSchedule'] | 'any';
  cleanliness?: User['habits']['cleanliness'] | 'any';
  guestFrequency?: User['habits']['guestFrequency'] | 'any';
};