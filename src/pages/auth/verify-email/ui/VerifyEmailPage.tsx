import { useSearchParams, useNavigate } from 'react-router-dom';
import RoundedButton from '../../../../shared/ui/RoundedButton/RoundedButton';
import { RoutePaths } from '../../../../app/router/routePaths';
import shared from '../../auth.shared.module.css';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') ?? 'your@email.com';

  return (
    <div className={shared.pageWrapper}>
      <div className={shared.left}>
        <div className={shared.card}>
          <h2 className={shared.cardTitle}>Проверь почту</h2>
          <p className={shared.cardSubtitle}>
            Мы отправили ссылку на {email}.
            <br />
            Перейди по ней, чтобы активировать профиль.
          </p>

          <div className={shared.hint}>Если письма нет — проверь «Спам».</div>

          <RoundedButton
            type="primary"
            block
            size="large"
            onClick={() => window.open('https://mail.google.com')}
            style={{ marginBottom: 12 }}
          >
            Открыть почту
          </RoundedButton>

          <RoundedButton block size="large" style={{ marginBottom: 16 }}>
            Отправить ещё раз
          </RoundedButton>

          <div className={shared.linkRow}>
            <span onClick={() => navigate(RoutePaths.AUTH)}>Ошиблась(ся) почтой? Изменить</span>
          </div>
        </div>
      </div>

      <div className={shared.right}>
        <div className={shared.card}>
          <h3 className={shared.rightTitle}>Зачем подтверждение?</h3>
          <p className={shared.rightText}>
            Подтверждение защищает от фейковых аккаунтов и позволяет безопасно открывать чат только
            после мэтча.
          </p>
          <div
            style={{
              background: '#ccff00',
              borderRadius: 12,
              height: 160,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
