import { useState } from 'react';
import { Input, Form } from 'antd';
import RoundedButton from '../../../shared/ui/RoundedButton/RoundedButton';
import styles from './AuthPage.module.css';

type AuthMode = 'login' | 'register';

interface LoginFormValues {
  email: string;
  password: string;
}

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loginForm] = Form.useForm<LoginFormValues>();
  const [registerForm] = Form.useForm<RegisterFormValues>();

  const handleLogin = (values: LoginFormValues) => {
    console.log('login', values);
  };

  const handleRegister = (values: RegisterFormValues) => {
    console.log('register', values);
  };

  const hint = (
    <div className={styles.hint}>
      Пароль можно восстановить. Данные анкеты видны только тем, кому ты поставил(а) лайк.
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.card}>
          {mode === 'login' ? (
            <>
              <h2 className={styles.title}>Добро пожаловать</h2>
              <Form form={loginForm} onFinish={handleLogin} layout="vertical" requiredMark={false}>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Введите почту' },
                    { type: 'email', message: 'Неверный формат почты' },
                  ]}
                >
                  <Input
                    placeholder="student@university.ru"
                    className={styles.input}
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Введите пароль' },
                    { min: 8, message: 'Минимум 8 символов' },
                  ]}
                >
                  <Input.Password placeholder="Пароль" className={styles.input} size="large" />
                </Form.Item>

                <Form.Item>
                  <RoundedButton type="primary" htmlType="submit" block size="large">
                    Войти
                  </RoundedButton>
                </Form.Item>
              </Form>

              <p className={styles.switchText}>
                Нет аккаунта?{' '}
                <button className={styles.switchLink} onClick={() => setMode('register')}>
                  Зарегистрироваться
                </button>
              </p>

              {hint}
            </>
          ) : (
            <>
              <h2 className={styles.title}>Создать аккаунт</h2>
              <Form
                form={registerForm}
                onFinish={handleRegister}
                layout="vertical"
                requiredMark={false}
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Введите почту' },
                    { type: 'email', message: 'Неверный формат почты' },
                  ]}
                >
                  <Input
                    placeholder="student@university.ru"
                    className={styles.input}
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Введите пароль' },
                    { min: 8, message: 'Минимум 8 символов' },
                  ]}
                >
                  <Input.Password placeholder="Пароль" className={styles.input} size="large" />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Повторите пароль' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Пароли не совпадают'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder="Повторите пароль"
                    className={styles.input}
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <RoundedButton type="primary" htmlType="submit" block size="large">
                    Зарегистрироваться
                  </RoundedButton>
                </Form.Item>
              </Form>

              <p className={styles.switchText}>
                Уже есть аккаунт?{' '}
                <button className={styles.switchLink} onClick={() => setMode('login')}>
                  Войти
                </button>
              </p>

              {hint}
            </>
          )}
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <h3 className={styles.rightTitle}>Как это работает</h3>
          <p className={styles.rightText}>
            1) Заполни привычки
            <br />
            2) Лайкай подходящих
            <br />
            3) Совпадение → чат
          </p>

          <h3 className={styles.rightTitle}>Безопасность</h3>
          <p className={styles.rightText}>
            Можно скрыть контакты и включить «тихие часы». В чате доступны жалоба и блокировка.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
