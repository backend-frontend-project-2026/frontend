import { useLocation, Link } from 'react-router-dom';
import { Card, Typography } from 'antd';
import RoundedButton from '@/shared/ui/RoundedButton/RoundedButton';
import { RoutePaths } from '@/app/router/routePaths';
import shared from '@/shared/styles/auth.shared.module.css';
import styles from './VerifyEmailPage.module.css';

const { Title, Text, Paragraph } = Typography;

const VerifyEmailPage = () => {
  const location = useLocation();
  const email = location.state?.email ?? 'your@email.com';

  return (
    <div className={shared.pageWrapper}>
      <div className={shared.left}>
        <Card variant="outlined">
          <Title level={2}>Проверь почту</Title>
          <Paragraph type="secondary">
            Мы отправили ссылку на {email}.
            <br />
            Перейди по ней, чтобы активировать профиль.
          </Paragraph>

          <div className={shared.hint}>Если письма нет — проверь «Спам».</div>

          <RoundedButton
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
          <Typography.Title level={4}>Зачем подтверждение?</Typography.Title>
          <Typography.Paragraph type="secondary">
            Подтверждение защищает от фейковых аккаунтов и позволяет безопасно открывать чат только
            после мэтча.
          </Typography.Paragraph>
          <Text type="secondary" className={styles.accessNote}>
            После подтверждения вы получите доступ к поиску соседей.
          </Text>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
