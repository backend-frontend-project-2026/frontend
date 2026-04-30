import { useNavigate, useSearchParams } from 'react-router-dom';
import { Result } from 'antd';
import RoundedButton from '@/shared/ui/RoundedButton/RoundedButton';
import { RoutePaths } from '@/app/router/routePaths';
import styles from './ErrorPage.module.css';

const errorMessages: Record<string, string> = {
  invalid_token: 'Ссылка недействительна.',
  token_expired: 'Ссылка устарела. Запросите новую.',
  already_verified: 'Email уже подтверждён.',
};

const ErrorPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') ?? 'unknown';
  const subTitle = errorMessages[reason] ?? 'Что-то пошло не так. Попробуйте снова.';

  return (
    <div className={styles.page}>
      <Result
        status="error"
        title="Ошибка"
        subTitle={subTitle}
        extra={
          <RoundedButton variant="dark" onClick={() => navigate(RoutePaths.LOGIN)}>
            На страницу входа
          </RoundedButton>
        }
      />
    </div>
  );
};

export default ErrorPage;
