import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Typography, Input, Form, message } from 'antd';
import RoundedButton from '@/shared/ui/RoundedButton/RoundedButton';
import { RoutePaths } from '@/app/router/routePaths';
import styles from './ResetPasswordPage.module.css';

const { Title, Text } = Typography;

interface FormValues {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (_values: FormValues) => {
    if (!token) {
      message.error('Ссылка недействительна. Запросите новую.');
      return;
    }

    try {
      setLoading(true);
      // TODO: заменить на API когда бэкенд добавит эндпоинт
      // POST /auth/reset-password { token, password: _values.password }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch {
      message.error('Не удалось изменить пароль. Ссылка могла устареть.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {success ? (
        <Card variant="outlined" className={styles.card}>
          <Title level={2} className={styles.title}>
            Пароль изменён
          </Title>
          <Text type="secondary" className={styles.subtitle}>
            Теперь можешь войти с новым паролем.
          </Text>
          <RoundedButton variant="dark" size="large" onClick={() => navigate(RoutePaths.LOGIN)}>
            Войти
          </RoundedButton>
        </Card>
      ) : (
        <Card variant="outlined" className={styles.card}>
          <Title level={2} className={styles.title}>
            Новый пароль
          </Title>
          <Text type="secondary" className={styles.subtitle}>
            Задай новый пароль для аккаунта.
          </Text>

          <Form form={form} onFinish={handleSubmit} layout="vertical" requiredMark={false}>
            <div className={styles.fieldsRow}>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Введите пароль' },
                  { min: 8, message: 'Минимум 8 символов' },
                ]}
              >
                <Input.Password
                  placeholder="Новый пароль"
                  className={styles.input}
                  size="large"
                />
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
                  placeholder="Повтори пароль"
                  className={styles.input}
                  size="large"
                />
              </Form.Item>
            </div>

            <p className={styles.hint}>Минимум 8 символов.</p>

            <Form.Item>
              <RoundedButton variant="dark" htmlType="submit" size="large" loading={loading}>
                Сохранить пароль
              </RoundedButton>
            </Form.Item>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default ResetPasswordPage;