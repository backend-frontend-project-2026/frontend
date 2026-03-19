import { useState } from 'react';
import { Card, Typography, Input, Form } from 'antd';
import RoundedButton from '@/shared/ui/RoundedButton/RoundedButton';
import styles from './AuthPage.module.css';

const { Title, Text, Link } = Typography;

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

  const handleLogin = (_values: LoginFormValues) => {
    // TODO: вызов API авторизации
  };

  const handleRegister = (_values: RegisterFormValues) => {
    // TODO: вызов API регистрации
  };

  const hint = (
    <div className={styles.hint}>
      Пароль можно восстановить. Данные анкеты видны только тем, кому ты поставил(а) лайк.
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <Card variant="outlined" className={styles.card}>
          {mode === 'login' ? (
            <>
              <Title level={2} className={styles.title}>
                Добро пожаловать
              </Title>
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

              <Text type="secondary">
                Нет аккаунта?{' '}
                <Link onClick={() => setMode('register')}>Зарегистрироваться</Link>
              </Text>

              {hint}
            </>
          ) : (
            <>
              <Title level={2} className={styles.title}>
                Создать аккаунт
              </Title>
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

              <Text type="secondary">
                Уже есть аккаунт? <Link onClick={() => setMode('login')}>Войти</Link>
              </Text>

              {hint}
            </>
          )}
        </Card>
      </div>

      <div className={styles.right}>
        <Card variant="outlined" className={styles.card}>
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
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
