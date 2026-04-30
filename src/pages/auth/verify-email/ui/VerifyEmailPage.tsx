import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, Typography, message } from 'antd';
import RoundedButton from '@/shared/ui/RoundedButton/RoundedButton';
import { RoutePaths } from '@/app/router/routePaths';
import shared from '@/shared/styles/auth.shared.module.css';
import styles from './VerifyEmailPage.module.css';
import { useCountdown } from '@/shared/hooks/useCountdown';

const { Title, Text, Paragraph } = Typography;

const VerifyEmailPage = () => {
  const location = useLocation();
  const email = location.state?.email ?? 'your@email.com';

  const [resending, setResending] = useState(false);

  const { seconds: cooldown, start } = useCountdown(60);

  const handleResend = async () => {
    if (cooldown > 0) return;

    try {
      setResending(true);
      // TODO: заменить на API когда бэкенд добавит эндпоинт
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success('Письмо отправлено повторно');

      start();
    } catch {
      message.error('Не удалось отправить письмо');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className={shared.pageWrapper}>
      <div className={shared.left}>
        <Card variant="outlined">
          <Title level={2}>Проверьте почту</Title>
          <Paragraph type="secondary">
            Мы отправили ссылку на {email}.
            <br />
            Перейдите по ней, чтобы активировать профиль.
          </Paragraph>

          <div className={shared.hint}>Если письма нет — проверьте папку «Спам».</div>

          <RoundedButton
            block
            size="large"
            href="https://mail.google.com"
            target="_blank"
            className={styles.buttonPrimary}
          >
            Открыть почту
          </RoundedButton>

          <RoundedButton
            block
            size="large"
            onClick={handleResend}
            loading={resending}
            disabled={cooldown > 0}
            className={styles.buttonSecondary}
          >
            {cooldown > 0 ? `Отправить ещё раз (${cooldown}с)` : 'Отправить ещё раз'}
          </RoundedButton>

          <div className={shared.linkRow}>
            <Text type="secondary">
              Неверная почта? <Link to={RoutePaths.AUTH}>Изменить</Link>
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
