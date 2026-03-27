import type { User } from '../../../entities/user';

export type DiscoverEmptyState = {
  title: string;
  text: string;
  buttonText: string;
};

type GetDiscoverPageStateParams = {
  users: User[];
  totalUsersCount: number;
  matchingUsersCount: number;
  hasActiveFilters: boolean;
};

export function getDiscoverEmptyState({
  users,
  totalUsersCount,
  matchingUsersCount,
  hasActiveFilters,
}: GetDiscoverPageStateParams): DiscoverEmptyState | null {
  const hasUsers = users.length > 0;

  if (hasUsers) {
    return null;
  }

  if (matchingUsersCount === 0 && hasActiveFilters) {
    return {
      title: 'Ничего не найдено',
      text: 'По выбранным фильтрам никто не подошёл. Попробуй ослабить условия.',
      buttonText: 'Открыть фильтры',
    };
  }

  if (totalUsersCount === 0) {
    return {
      title: 'Анкет пока нет',
      text: 'Сейчас в локальной подборке нет карточек. Позже можно добавить новые моки.',
      buttonText: 'Открыть фильтры',
    };
  }

  return {
    title: 'Карточки закончились',
    text: 'Все доступные анкеты уже просмотрены. Можно открыть фильтры или обновить подборку.',
    buttonText: 'Открыть фильтры',
  };
}

export function getDiscoverFiltersStatusLabel(hasActiveFilters: boolean) {
  return hasActiveFilters ? 'Есть активные фильтры' : 'Фильтры не выбраны';
}
