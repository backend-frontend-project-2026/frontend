import type { User } from '../../../entities/user';

export type BasicInfoFormValue = {
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

export type BasicInfoErrors = Partial<Record<keyof BasicInfoFormValue, string>>;
