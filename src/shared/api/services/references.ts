import {
  getCities,
  getNeighbourhoods,
  getReferencesHousingTypes,
  getTags,
  getUniversities,
  getUniversitiesByUniversityIdFaculties,
  type CityListResponse,
  type GetCitiesData,
  type GetNeighbourhoodsData,
  type GetTagsData,
  type GetUniversitiesByUniversityIdFacultiesData,
  type GetUniversitiesData,
  type ReferenceListResponse,
  type ReferenceOption,
  type TagListResponse,
  type TagResponse,
} from '@/shared/api/generated';

type UniversitiesQuery = NonNullable<GetUniversitiesData['query']>;
type FacultiesQuery = NonNullable<GetUniversitiesByUniversityIdFacultiesData['query']>;
type NeighbourhoodsQuery = NonNullable<GetNeighbourhoodsData['query']>;
type CitiesQuery = NonNullable<GetCitiesData['query']>;
type TagsQuery = NonNullable<GetTagsData['query']>;

export type ReferenceSelectOption = ReferenceOption;
export type TagCategory = NonNullable<TagsQuery['category']>;

export type HabitReferenceKey =
  | 'sleepSchedule'
  | 'cleanliness'
  | 'noiseLevel'
  | 'guestFrequency'
  | 'smokingPreference'
  | 'alcoholPreference'
  | 'roomOrderPreference'
  | 'petPreference';

export type HabitReferenceMap = Record<HabitReferenceKey, ReferenceSelectOption[]>;

export const EMPTY_HABIT_REFERENCES: HabitReferenceMap = {
  sleepSchedule: [],
  cleanliness: [],
  noiseLevel: [],
  guestFrequency: [],
  smokingPreference: [],
  alcoholPreference: [],
  roomOrderPreference: [],
  petPreference: [],
};

const HABIT_REFERENCE_CATEGORIES: Array<[HabitReferenceKey, TagCategory]> = [
  ['sleepSchedule', 'sleep_schedule'],
  ['cleanliness', 'cleanliness'],
  ['noiseLevel', 'noise_level'],
  ['guestFrequency', 'guest_frequency'],
  ['smokingPreference', 'smoking_preference'],
  ['alcoholPreference', 'alcohol_preference'],
  ['roomOrderPreference', 'room_order_preference'],
  ['petPreference', 'pet_preference'],
];

function mapTagToReferenceOption(tag: TagResponse): ReferenceSelectOption {
  return {
    value: tag.value,
    label: tag.label,
  };
}

export const referencesApi = {
  listUniversities: (query?: UniversitiesQuery) => getUniversities(query ? { query } : {}),

  listFaculties: (universityId: number, query?: FacultiesQuery) =>
    getUniversitiesByUniversityIdFaculties({
      path: { university_id: universityId },
      ...(query ? { query } : {}),
    }),

  listNeighbourhoods: (query?: NeighbourhoodsQuery) =>
    getNeighbourhoods(query ? { query } : {}),

  listCities: async (query?: CitiesQuery): Promise<CityListResponse> => {
    const result = await getCities<true>({
      query: {
        page: 1,
        page_size: 100,
        ...query,
      },
      throwOnError: true,
    });

    return result.data;
  },

  listHousingTypes: async (): Promise<ReferenceListResponse> => {
    const result = await getReferencesHousingTypes<true>({
      throwOnError: true,
    });

    return result.data;
  },

  listTags: async (query?: TagsQuery): Promise<TagListResponse> => {
    const result = await getTags<true>({
      query: {
        page: 1,
        page_size: 100,
        ...query,
      },
      throwOnError: true,
    });

    return result.data;
  },

  listTagOptionsByCategory: async (category: TagCategory): Promise<ReferenceSelectOption[]> => {
    const tags = await referencesApi.listTags({ category });

    return tags.items.map(mapTagToReferenceOption);
  },

  listHabitReferences: async (): Promise<HabitReferenceMap> => {
    const tags = await referencesApi.listTags({
      page: 1,
      page_size: 1000,
    });

    return HABIT_REFERENCE_CATEGORIES.reduce<HabitReferenceMap>(
      (acc, [key, category]) => ({
        ...acc,
        [key]: tags.items
          .filter((tag) => tag.category === category)
          .map(mapTagToReferenceOption),
      }),
      { ...EMPTY_HABIT_REFERENCES }
    );
  },

  listInterestOptions: async (): Promise<ReferenceSelectOption[]> =>
    referencesApi.listTagOptionsByCategory('interests'),
};