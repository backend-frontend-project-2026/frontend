import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Button, Card, Typography, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import styles from './ErrorBoundary.module.css';

const { Title, Paragraph, Text } = Typography;

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Поймана ошибка:', error);
    console.log('Стек компонентов:', errorInfo.componentStack);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      if (fallback && error) {
        return fallback(error, this.resetError);
      }

      return (
        <div className={styles.container}>
          <Card className={styles.card} bordered={false}>
            <Space direction="vertical" size="large" className={styles.space}>
              <Title level={2} className={styles.title}>
                Что-то пошло не так...
              </Title>
              <Paragraph className={styles.paragraph}>
                Мы уже работаем над исправлением. Попробуйте перезагрузить страницу.
              </Paragraph>
              {error && (
                <div className={styles.errorBlock}>
                  <Text code className={styles.errorText}>
                    {error.message}
                  </Text>
                </div>
              )}
              <Space size="middle">
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={() => window.location.reload()}
                  className={styles.buttonPrimary}
                >
                  Перезагрузить
                </Button>
                <Button
                  onClick={this.resetError}
                  className={styles.buttonDefault}
                >
                  Попробовать снова
                </Button>
              </Space>
            </Space>
          </Card>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;