import { useNavigate } from 'react-router-dom';
import { Input, Form } from 'antd';
import RoundedButton from '../../../../shared/ui/RoundedButton/RoundedButton';
import { RoutePaths } from '../../../../app/router/routePaths';
import shared from '../../auth.shared.module.css';
import styles from './ForgotPasswordPage.module.css';

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
        <div className={shared.card}>
          <h2 className={shared.cardTitle}>Восстановление пароля</h2>
          <p className={shared.cardSubtitle}>Введи почту — отправим ссылку для сброса.</p>

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
            <span onClick={() => navigate(RoutePaths.AUTH)}>Вспомнил(а) пароль? Войти</span>
          </div>
        </div>
      </div>

      <div className={shared.right}>
        <div className={shared.card}>
          <h3 className={shared.rightTitle}>Безопасность</h3>
          <p className={shared.rightText}>
            Ссылка для сброса действует 30 минут.
            <br />
            После перехода по ней старый пароль перестанет работать.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
