import { Navigate, useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';
import { useRoomieFlow } from '@/app/providers/roomie-flow';
import DiscoverPage from '@/pages/discover/ui/DiscoverPage';
import { FiltersPage } from '@/pages/filters';

export function DiscoverRoute() {
  const navigate = useNavigate();
  const {
    completed,
    activeFilters,
    availableUsers,
    totalUsersCount,
    matchingUsersCount,
    filtersAreActive,
    applyCurrentFilters,
    resetFilters,
    clearSkippedProfiles,
    openProfile,
    handleLike,
    handleSkip,
    handleSuperLike,
  } = useRoomieFlow();

  if (!completed) {
    return <Navigate to={RoutePaths.ONBOARDING_STEP_1} replace />;
  }

  return (
    <DiscoverPage
      users={availableUsers}
      totalUsersCount={totalUsersCount}
      matchingUsersCount={matchingUsersCount}
      hasActiveFilters={filtersAreActive}
      activeFilters={activeFilters}
      onOpenFilters={() => navigate(RoutePaths.FILTERS)}
      onResetFilters={() => {
        clearSkippedProfiles();
        resetFilters();
      }}
      onApplyFilters={applyCurrentFilters}
      onOpenProfile={(user) => {
        openProfile(user);
        navigate(RoutePaths.userProfile(user.id));
      }}
      onLike={handleLike}
      onSkip={handleSkip}
      onSuperLike={handleSuperLike}
    />
  );
}

export function FiltersRoute() {
  const navigate = useNavigate();
  const {
    completed,
    draft,
    activeFilters,
    filteredUsers,
    applyCurrentFilters,
    clearSkippedProfiles,
  } = useRoomieFlow();

  if (!completed) {
    return <Navigate to={RoutePaths.ONBOARDING_STEP_1} replace />;
  }

  return (
    <FiltersPage
      initialFilters={activeFilters}
      currentUserUniversity={draft.basicInfo.university}
      currentUserLocation={draft.basicInfo.location}
      usersForPreview={filteredUsers}
      onBack={() => navigate(RoutePaths.DISCOVER)}
      onApply={(filters) => {
        clearSkippedProfiles();
        applyCurrentFilters(filters);
        navigate(RoutePaths.DISCOVER);
      }}
    />
  );
}
