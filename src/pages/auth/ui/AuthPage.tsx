import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';
import styles from './AuthPage.module.css';

interface AuthPageProps {
  mode?: 'login' | 'register';
}

const AuthPage = ({ mode: initialMode }: AuthPageProps) => {
  const navigate = useNavigate();
  const mode = initialMode || 'login';

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      navigate(RoutePaths.DISCOVER);
    }
  }, [navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? '/api/login' : '/api/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Ошибка сервера');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      navigate(RoutePaths.DISCOVER);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Что-то пошло не так');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    navigate(mode === 'login' ? RoutePaths.REGISTER : RoutePaths.LOGIN);
  };

  const renderFormFields = () => (
    <>
      <div className={styles.field}>
        <label htmlFor="email">Почта</label>
        <input
          id="email"
          type="email"
          placeholder="student@university.ru"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Пароль</label>
        <input
          id="password"
          type="password"
          placeholder="*********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" disabled={loading} className={styles.submitButton}>
        <span>{loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</span>
        <span className={styles.buttonIcon}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 17L17 7M17 7H9M17 7V15"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div className={styles.switchLink}>
        {mode === 'login' ? (
          <>
            Нет аккаунта?{' '}
            <button type="button" onClick={switchMode} className={styles.greenLink}>
              Зарегистрироваться
            </button>
          </>
        ) : (
          <>
            Есть аккаунт?{' '}
            <button type="button" onClick={switchMode} className={styles.greenLink}>
              Войти
            </button>
          </>
        )}
      </div>
    </>
  );

  const desktopLayout = (
    <div className={styles.desktopLayout}>
      <div className={styles.leftColumn}>
        <h2 className={styles.modeTitle}>{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>
        <div className={styles.formCard}>
          <h1 className={styles.welcomeTitle}>Добро пожаловать</h1>
          <p className={styles.welcomeSubtitle}>
            Подберём соседа по привычкам — быстро и спокойно.
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            {renderFormFields()}
          </form>
          <div className={styles.greenHint}>
            Пароль можно восстановить. Данные анкеты видны только тем, кому ты поставил(а) лайк.
          </div>
        </div>
      </div>

      <div className={styles.rightColumn}>
        <div className={styles.infoCard}>
          <h3 className={styles.infoTitle}>Как это работает</h3>
          <ol className={styles.infoList}>
            <li>Заполните анкету</li>
            <li>Личный подбор</li>
            <li>Согласование условий</li>
            <li>Безопасность</li>
          </ol>
          <p className={styles.infoText}>
            Можно скрыть контакты и включить «тихие часы». В чате доступны жалоба и блокировка.
          </p>
          <h3 className={styles.infoTitle}>Безопасность</h3>
          <p className={styles.infoText}>
            Ваши данные видны только внутри сервиса. Мы не передаём информацию третьим лицам.
          </p>
        </div>
      </div>
    </div>
  );

  const mobileLayout = (
    <div className={styles.mobileLayout}>
      <div className={styles.mobileHeader}>
        <h1 className={styles.mobileTitle}>Добро пожаловать</h1>
        <p className={styles.mobileSubtitle}>Подберём соседа по привычкам — быстро и спокойно.</p>
      </div>
      <div className={styles.mobileFormCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {renderFormFields()}
        </form>
      </div>
      <div className={styles.mobileHint}>
        Пароль можно восстановить. Данные анкеты видны только внутри сервиса.
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      {desktopLayout}
      {mobileLayout}
    </div>
  );
};

export default AuthPage;
