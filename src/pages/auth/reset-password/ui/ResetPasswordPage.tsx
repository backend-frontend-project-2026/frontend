import { useNavigate } from 'react-router-dom';
import { Input, Form } from 'antd';
import RoundedButton from '@/shared/ui/RoundedButton/RoundedButton';
import ArrowUpRightIcon from '@/assets/icons/arrow-up-right.svg?react';
import { RoutePaths } from '@/app/router/routePaths';
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
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Новый пароль</h2>
        <p className={styles.subtitle}>Задай новый пароль для аккаунта.</p>

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
            <RoundedButton
              type="primary"
              htmlType="submit"
              size="large"
              className={styles.submitButton}
              icon={
                <span className={`${styles.iconCircle} ${styles.iconCircleLight}`}>
                  <ArrowUpRightIcon />
                </span>
              }
            >
              Сохранить пароль
            </RoundedButton>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
