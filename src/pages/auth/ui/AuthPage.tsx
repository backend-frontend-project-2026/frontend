import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Input, Form, Button, message } from 'antd';
import { RoutePaths } from '@/app/router/routePaths';
import RoundedButton from '@/shared/ui/RoundedButton/RoundedButton';
import { getApiErrorMessage, type AuthResponse } from '@/shared/api';
import { authApi } from '@/shared/api/services/auth';
import { saveAuthSession } from '@/shared/api/auth/session';
import styles from './AuthPage.module.css';

const { Title, Text } = Typography;

export type AuthMode = 'login' | 'register';

interface LoginFormValues {
  email: string;
  password: string;
}

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthPageProps {
  mode?: AuthMode; // пропс для передачи начального режима
}

const AuthPage = ({ mode: initialMode }: AuthPageProps) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [mode, setMode] = useState<AuthMode>(initialMode ?? 'login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginForm] = Form.useForm<LoginFormValues>();
  const [registerForm] = Form.useForm<RegisterFormValues>();

  const handleAuth = async (apiCall: () => Promise<AuthResponse>, successMessage: string) => {
    try {
      setIsSubmitting(true);
      const authResponse = await apiCall();

      saveAuthSession(authResponse);
      messageApi.success(successMessage);
      navigate(RoutePaths.DISCOVER);
    } catch (error) {
      messageApi.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (values: LoginFormValues) => {
    await handleAuth(
      () =>
        authApi.login({
          email: values.email,
          password: values.password,
        }),
      'Вход выполнен'
    );
  };

  const handleRegister = async (values: RegisterFormValues) => {
    await handleAuth(
      () =>
        authApi.register({
          first_name: values.firstName.trim(),
          last_name: values.lastName.trim(),
          email: values.email,
          password: values.password,
        }),
      'Аккаунт успешно создан'
    );
  };

  const hint = (
    <div className={styles.hint}>
      Пароль можно восстановить. Данные анкеты видны только тем, кому ты поставил(а) лайк.
    </div>
  );

  return (
    <>
      {contextHolder}
      <div className={styles.page}>
        <div className={styles.left}>
          <Card variant="outlined" className={styles.card}>
            {mode === 'login' ? (
              <>
                <Title level={2} className={styles.title}>
                  Добро пожаловать
                </Title>
                <Form
                  form={loginForm}
                  onFinish={handleLogin}
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

                  <Form.Item>
                    <RoundedButton htmlType="submit" block size="large" loading={isSubmitting}>
                      Войти
                    </RoundedButton>
                  </Form.Item>
                </Form>

                <Text type="secondary">
                  Нет аккаунта?{' '}
                  <Button type="link" onClick={() => setMode('register')} style={{ padding: 0 }}>
                    Зарегистрироваться
                  </Button>
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
                  <Form.Item name="firstName" rules={[{ required: true, message: 'Введите имя' }]}>
                    <Input placeholder="Имя" className={styles.input} size="large" />
                  </Form.Item>

                  <Form.Item
                    name="lastName"
                    rules={[{ required: true, message: 'Введите фамилию' }]}
                  >
                    <Input placeholder="Фамилия" className={styles.input} size="large" />
                  </Form.Item>

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
                    <RoundedButton htmlType="submit" block size="large" loading={isSubmitting}>
                      Зарегистрироваться
                    </RoundedButton>
                  </Form.Item>
                </Form>

                <Text type="secondary">
                  Уже есть аккаунт?{' '}
                  <Button type="link" onClick={() => setMode('login')} style={{ padding: 0 }}>
                    Войти
                  </Button>
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
    </>
  );
};

export default AuthPage;
