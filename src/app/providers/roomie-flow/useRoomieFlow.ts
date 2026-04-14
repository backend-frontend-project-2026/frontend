import { useMemo } from 'react';
import { useDiscoverFlow } from './discover-context';
import { useFiltersFlow } from './filters-context';
import { useOnboardingFlow } from './onboarding-context';
import { useProfileFlow } from './profile-context';
import type { RoomieFlowContextValue } from './types';

export function useRoomieFlow(): RoomieFlowContextValue {
  const onboarding = useOnboardingFlow();
  const filters = useFiltersFlow();
  const discover = useDiscoverFlow();
  const profile = useProfileFlow();

  return useMemo(
    () => ({
      ...onboarding,
      ...filters,
      ...discover,
      ...profile,
    }),
    [onboarding, filters, discover, profile]
  );
}
