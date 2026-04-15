import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Typography, Input, Form, message } from 'antd';
import RoundedButton from '@/shared/ui/RoundedButton/RoundedButton';
import { RoutePaths } from '@/app/router/routePaths';
import shared from '@/shared/styles/auth.shared.module.css';
import styles from './ForgotPasswordPage.module.css';

const { Title, Text, Paragraph } = Typography;

interface FormValues {
  email: string;
}

const ForgotPasswordPage = () => {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      // TODO: заменить на API когда бэкенд добавит эндпоинт
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmittedEmail(values.email);
      setSent(true);
    } catch {
      message.error('Не удалось отправить письмо. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={shared.pageWrapper}>
      <div className={shared.left}>
        {sent ? (
          <Card variant="outlined">
            <Title level={2}>Письмо отправлено</Title>
            <Paragraph type="secondary">
              Мы отправили ссылку для сброса пароля на {submittedEmail}.
              <br />
              Перейди по ней — ссылка действует 30 минут.
            </Paragraph>

            <div className={shared.hint}>Если письма нет — проверь «Спам».</div>

            <RoundedButton block size="large" href="https://mail.google.com" target="_blank">
              Открыть почту
            </RoundedButton>

            <div className={shared.linkRow}>
              <Text type="secondary">
                Вспомнил(а) пароль? <Link to={RoutePaths.LOGIN}>Войти</Link>
              </Text>
            </div>
          </Card>
        ) : (
          <Card variant="outlined">
            <Title level={2}>Восстановление пароля</Title>
            <Paragraph type="secondary">Введи почту — отправим ссылку для сброса.</Paragraph>

            <Form form={form} onFinish={handleSubmit} layout="vertical" requiredMark={false}>
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

              <Form.Item>
                <RoundedButton htmlType="submit" block size="large" loading={loading}>
                  Отправить
                </RoundedButton>
              </Form.Item>
            </Form>

            <div className={shared.linkRow}>
              <Text type="secondary">
                Вспомнил(а) пароль? <Link to={RoutePaths.AUTH}>Войти</Link>
              </Text>
            </div>
          </Card>
        )}
      </div>

      <div className={shared.right}>
        <Card variant="outlined">
          <Typography.Title level={4}>Безопасность</Typography.Title>
          <Typography.Paragraph type="secondary">
            Ссылка для сброса действует 30 минут.
            <br />
            После перехода по ней старый пароль перестанет работать.
          </Typography.Paragraph>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;