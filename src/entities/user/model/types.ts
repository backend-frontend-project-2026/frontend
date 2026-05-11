export type SleepSchedule = 'early_bird' | 'night_owl' | 'flexible';

export type CleanlinessLevel = 'low' | 'medium' | 'high';

export type NoiseLevel = 'quiet' | 'moderate' | 'social';

export type GuestFrequency = 'never' | 'rarely' | 'sometimes' | 'often';

export type PetPreference = 'no_pets' | 'has_pets' | 'pet_friendly';

export type SmokingPreference = 'no' | 'outside_only' | 'yes';

export type AlcoholPreference = 'no' | 'rarely' | 'socially' | 'yes';

export type RoomOrderPreference = 'strict' | 'balanced' | 'flexible';

export type StayDuration = '1-3 months' | '3-6 months' | '6-12 months' | '12+ months';

export type HousingType = 'dormitory' | 'rental';

export type Gender = 'female' | 'male';

export type QuietTime = {
  from: string;
  to: string;
};

export type UserHabits = {
  sleepSchedule: SleepSchedule;
  cleanliness: CleanlinessLevel;
  noiseLevel: NoiseLevel;
  guestFrequency: GuestFrequency;
  petPreference: PetPreference;
  smokingPreference: SmokingPreference;
  alcoholPreference: AlcoholPreference;
  roomOrderPreference: RoomOrderPreference;
  quietTime?: QuietTime;
};

export type User = {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  housingType: HousingType;
  university: string;
  course: string;
  faculty: string;
  location: string;
  district: string;
  bio: string;
  interests: string[];
  habits: UserHabits;
  budget: UserBudget;
  moveInDate: string;
  stayDuration: StayDuration;
  idealRoommateDescription: string;
  rentalCriteria: string;
  avatar: string;
  photos: string[];
  isSmokingAllowed: boolean;
  hasPets: boolean;
  hasQuietHours: boolean;
  verified?: boolean;
  compatibilityNote?: string;
};

export type UserBudget = {
  min: number;
  max: number;
  currency: '₽';
  period: 'month';
};
