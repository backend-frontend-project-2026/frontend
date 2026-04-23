import { Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';
import RoundedButton from '@/shared/ui/RoundedButton/RoundedButton';
import styles from './UserProfileStatusPage.module.css';

type UserProfileStatusPageProps = {
  variant: 'not-found' | 'error';
};

const content = {
  'not-found': {
    status: '404' as const,
    title: 'Пользователь не найден',
    subTitle:
      'Эта анкета недоступна: ссылка устарела, пользователь был удалён или такого id больше нет.',
    buttonLabel: 'Вернуться в поиск',
  },
  error: {
    status: 'error' as const,
    title: 'Не удалось открыть анкету',
    subTitle:
      'Ссылка на профиль повреждена или в ней не хватает id пользователя. Открой анкету заново из поиска.',
    buttonLabel: 'Перейти в поиск',
  },
};

const UserProfileStatusPage = ({ variant }: UserProfileStatusPageProps) => {
  const navigate = useNavigate();
  const current = content[variant];

  return (
    <div className={styles.page}>
      <Result
        status={current.status}
        title={current.title}
        subTitle={current.subTitle}
        className={styles.result}
        extra={
          <RoundedButton variant="dark" onClick={() => navigate(RoutePaths.DISCOVER)}>
            {current.buttonLabel}
          </RoundedButton>
        }
      />
    </div>
  );
};

export default UserProfileStatusPage;
