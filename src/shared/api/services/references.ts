import {
  getNeighbourhoods,
  getUniversities,
  getUniversitiesByUniversityIdFaculties,
  type GetNeighbourhoodsData,
  type GetUniversitiesByUniversityIdFacultiesData,
  type GetUniversitiesData,
} from '@/shared/api/generated';

type UniversitiesQuery = NonNullable<GetUniversitiesData['query']>;
type FacultiesQuery = NonNullable<GetUniversitiesByUniversityIdFacultiesData['query']>;
type NeighbourhoodsQuery = NonNullable<GetNeighbourhoodsData['query']>;

export const referencesApi = {
  listUniversities: (query?: UniversitiesQuery) => getUniversities(query ? { query } : {}),

  listFaculties: (universityId: number, query?: FacultiesQuery) =>
    getUniversitiesByUniversityIdFaculties({
      path: { university_id: universityId },
      ...(query ? { query } : {}),
    }),

  listNeighbourhoods: (query?: NeighbourhoodsQuery) => getNeighbourhoods(query ? { query } : {}),
};
