import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Card, Typography } from 'antd';
import RoundedButton from '@/shared/ui/RoundedButton/RoundedButton';
import { RoutePaths } from '@/app/router/routePaths';
import shared from '@/shared/styles/auth.shared.module.css';
import styles from './VerifyEmailPage.module.css';

const { Title, Text } = Typography;

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') ?? 'your@email.com';

  return (
    <div className={shared.pageWrapper}>
      <div className={shared.left}>
        <Card variant="outlined">
          <Title level={2}>Проверь почту</Title>
          <Typography.Paragraph type="secondary">
            Мы отправили ссылку на {email}.
            <br />
            Перейди по ней, чтобы активировать профиль.
          </Typography.Paragraph>

          <div className={shared.hint}>Если письма нет — проверь «Спам».</div>

          <RoundedButton
            type="primary"
            block
            size="large"
            onClick={() => window.open('https://mail.google.com')}
            className={styles.buttonPrimary}
          >
            Открыть почту
          </RoundedButton>

          <RoundedButton block size="large" className={styles.buttonSecondary}>
            Отправить ещё раз
          </RoundedButton>

          <div className={shared.linkRow}>
            <Text type="secondary">
              Ошиблась(ся) почтой? <Link to={RoutePaths.AUTH}>Изменить</Link>
            </Text>
          </div>
        </Card>
      </div>

      <div className={shared.right}>
        <Card variant="outlined">
          <h3 className={shared.rightTitle}>Зачем подтверждение?</h3>
          <p className={shared.rightText}>
            Подтверждение защищает от фейковых аккаунтов и позволяет безопасно открывать чат только
            после мэтча.
          </p>
          <Text type="secondary" style={{ fontSize: 13 }}>
            После подтверждения вы получите доступ к поиску соседей.
          </Text>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
