import { useNavigate } from 'react-router-dom';
import { Result } from 'antd';
import RoundedButton from '@/shared/ui/RoundedButton/RoundedButton';
import { RoutePaths } from '@/app/router/routePaths';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <Result
        status="404"
        title={<span className={styles.code}>404</span>}
        subTitle="Похоже, эта страница съехала и не оставила адреса. Вернись на главную и найди нового соседа!"
        extra={
          <RoundedButton variant="dark" onClick={() => navigate(RoutePaths.LANDING)}>
            На главную
          </RoundedButton>
        }
        className={styles.result}
      />
    </div>
  );
};

export default NotFoundPage;
