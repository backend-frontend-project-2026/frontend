import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Card, Typography, Input, Form } from 'antd';
import RoundedButton from '@/shared/ui/RoundedButton/RoundedButton';
import { RoutePaths } from '@/app/router/routePaths';
import shared from '@/shared/styles/auth.shared.module.css';
import styles from './ForgotPasswordPage.module.css';

const { Title, Text } = Typography;

interface FormValues {
  email: string;
}

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();

  const handleSubmit = (values: FormValues) => {
    navigate(`${RoutePaths.VERIFY_EMAIL}?email=${encodeURIComponent(values.email)}`);
  };

  return (
    <div className={shared.pageWrapper}>
      <div className={shared.left}>
        <Card variant="outlined">
          <Title level={2}>Восстановление пароля</Title>
          <Typography.Paragraph type="secondary">
            Введи почту — отправим ссылку для сброса.
          </Typography.Paragraph>

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
              <RoundedButton type="primary" htmlType="submit" block size="large">
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
          <h3 className={shared.rightTitle}>Безопасность</h3>
          <p className={shared.rightText}>
            Ссылка для сброса действует 30 минут.
            <br />
            После перехода по ней старый пароль перестанет работать.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
