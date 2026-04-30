import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Typography, Button, message } from 'antd';
import OTPInput from '@/shared/ui/OTPInput/OTPInput';
import RoundedButton from '@/shared/ui/RoundedButton/RoundedButton';
import { RoutePaths } from '@/app/router/routePaths';
import shared from '@/shared/styles/auth.shared.module.css';
import styles from './VerifyCodePage.module.css';

const { Title } = Typography;

const VerifyCodePage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(60);
  const [isRunning, setIsRunning] = useState(true);
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const handleResend = async () => {
    if (seconds > 0) return;

    try {
      setResending(true);
      // TODO: заменить на API когда бэкенд добавит эндпоинт
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success('Код отправлен повторно');
      setCode('');
      setSeconds(60);
      setIsRunning(true);
    } catch {
      message.error('Не удалось отправить код');
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    try {
      setVerifying(true);
      // TODO: заменить на API когда бэкенд добавит эндпоинт
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success('Email подтверждён');
      navigate(RoutePaths.ONBOARDING);
    } catch {
      message.error('Неверный код. Попробуйте ещё раз');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className={shared.pageWrapper}>
      <div className={shared.left}>
        <Card variant="outlined">
          <Title level={2}>Код подтверждения</Title>

          <OTPInput length={6} value={code} onChange={setCode} />

          <p className={styles.codeHint}>Код действителен 10 минут.</p>

          <RoundedButton
            block
            size="large"
            disabled={code.length < 6}
            loading={verifying}
            onClick={handleVerify}
            className={styles.submitButton}
          >
            Подтвердить
          </RoundedButton>

          <div className={shared.linkRow}>
            <Button
              type="link"
              disabled={seconds > 0 || resending}
              onClick={handleResend}
              style={{ padding: 0 }}
            >
              Отправить ещё раз{seconds > 0 ? ` (${seconds}с)` : ''}
            </Button>
            <Link to={RoutePaths.LOGIN}>Изменить почту</Link>
          </div>
        </Card>
      </div>

      <div className={shared.right}>
        <Card variant="outlined">
          <Typography.Title level={4}>Совет</Typography.Title>
          <Typography.Paragraph type="secondary">
            Если письмо не приходит, проверьте правильность адреса и папку «Спам».
          </Typography.Paragraph>
          <div className={shared.hint}>Можно запросить повторную отправку через 60 секунд.</div>
        </Card>
      </div>
    </div>
  );
};

export default VerifyCodePage;
