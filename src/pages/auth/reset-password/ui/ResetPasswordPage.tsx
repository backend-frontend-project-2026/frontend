import { useNavigate } from 'react-router-dom';
import { Input, Form } from 'antd';
import RoundedButton from '../../../../shared/ui/RoundedButton/RoundedButton';
import { RoutePaths } from '../../../../app/router/routePaths';
import shared from '../../auth.shared.module.css';
import styles from './ResetPasswordPage.module.css';

interface FormValues {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();

  const handleSubmit = () => {
    navigate(RoutePaths.AUTH);
  };

  return (
    <div className={shared.pageWrapper}>
      <div className={shared.left}>
        <div className={shared.card}>
          <h2 className={shared.cardTitle}>Новый пароль</h2>

          <Form form={form} onFinish={handleSubmit} layout="vertical" requiredMark={false}>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Введите пароль' },
                { min: 8, message: 'Минимум 8 символов' },
              ]}
            >
              <Input.Password placeholder="Новый пароль" className={styles.input} size="large" />
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
                Сохранить
              </RoundedButton>
            </Form.Item>
          </Form>
        </div>
      </div>

      <div className={shared.right} />
    </div>
  );
};

export default ResetPasswordPage;
