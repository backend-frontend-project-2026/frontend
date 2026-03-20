import { useNavigate, Link } from 'react-router-dom';
import { Card, Typography, Input, Form } from 'antd';
import RoundedButton from '@/shared/ui/RoundedButton/RoundedButton';
import { RoutePaths } from '@/app/router/routePaths';
import shared from '@/shared/styles/auth.shared.module.css';
import styles from './ForgotPasswordPage.module.css';

const { Title, Text, Paragraph } = Typography;

interface FormValues {
  email: string;
}

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();

  const handleSubmit = (values: FormValues) => {
    navigate(RoutePaths.VERIFY_EMAIL, { state: { email: values.email } });
  };

  return (
    <div className={shared.pageWrapper}>
      <div className={shared.left}>
        <Card variant="outlined">
          <Title level={2}>Восстановление пароля</Title>
          <Paragraph type="secondary">
            Введи почту — отправим ссылку для сброса.
          </Paragraph>

          <Form form={form} onFinish={handleSubmit} layout="vertical" requiredMark={false}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Введите почту' },
                { type: 'email', message: 'Неверный формат почты' },
              ]}
            >
              <Input placeholder="student@university.ru" className={styles.input} size="large" />
            </Form.Item>

            <Form.Item>
              <RoundedButton htmlType="submit" block size="large">
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
