import { useNavigate } from 'react-router-dom';
import { Result } from 'antd';
import RoundedButton from '@/shared/ui/RoundedButton/RoundedButton';
import { RoutePaths } from '@/app/router/routePaths';
import styles from './SuccessPage.module.css';

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <Result
        status="success"
        title="Email подтверждён!"
        subTitle="Твой аккаунт активирован. Теперь можешь войти и найти соседа."
        extra={
          <RoundedButton variant="dark" onClick={() => navigate(RoutePaths.LOGIN)}>
            Войти
          </RoundedButton>
        }
      />
    </div>
  );
};

export default SuccessPage;
