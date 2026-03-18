import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OTPInput from '@/shared/ui/OTPInput/OTPInput';
import RoundedButton from '@/shared/ui/RoundedButton/RoundedButton';
import { RoutePaths } from '@/app/router/routePaths';
import shared from '@/shared/styles/auth.shared.module.css';
import styles from './VerifyCodePage.module.css';

const VerifyCodePage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(60);
  const [isRunning, setIsRunning] = useState(true);

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

  const handleResend = () => {
    if (seconds > 0) return;
    setSeconds(60);
    setIsRunning(true);
  };

  return (
    <div className={shared.pageWrapper}>
      <div className={shared.left}>
        <div className={shared.card}>
          <h2 className={shared.cardTitle}>Код подтверждения</h2>

          <OTPInput length={6} value={code} onChange={setCode} />

          <p className={styles.codeHint}>Код действителен 10 минут.</p>

          <RoundedButton
            type="primary"
            block
            size="large"
            disabled={code.length < 6}
            className={styles.submitButton}
          >
            Подтвердить
          </RoundedButton>

          <div className={shared.linkRow}>
            <span className={seconds > 0 ? shared.disabled : ''} onClick={handleResend}>
              Отправить ещё раз{seconds > 0 ? ` (${seconds}с)` : ''}
            </span>
            <span onClick={() => navigate(RoutePaths.AUTH)}>Изменить почту</span>
          </div>
        </div>
      </div>

      <div className={shared.right}>
        <div className={shared.card}>
          <h3 className={shared.rightTitle}>Совет</h3>
          <p className={shared.rightText}>
            Если письмо не приходит, проверь правильность адреса и папку «Спам».
          </p>
          <div className={shared.hint}>Можно запросить повторную отправку через 60 секунд.</div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCodePage;
