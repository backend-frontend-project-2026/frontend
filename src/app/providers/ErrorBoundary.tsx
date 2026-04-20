import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Button, Card, Typography, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

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

      // Стилизованный fallback в духе проекта
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5', // var(--color-bg-page) или серый фон
            padding: 20,
          }}
        >
          <Card
            style={{
              maxWidth: 480,
              width: '100%',
              textAlign: 'center',
              borderRadius: 20,
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e8e8e8',
            }}
            bordered={false}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Title level={2} style={{ marginBottom: 0, color: '#1a1a1a' }}>
                Что-то пошло не так...
              </Title>
              <Paragraph style={{ color: '#666', fontSize: 16 }}>
                Мы уже работаем над исправлением. Попробуйте перезагрузить страницу.
              </Paragraph>
              {error && (
                <div
                  style={{
                    background: '#f9f9f9',
                    borderRadius: 12,
                    padding: '12px 16px',
                    textAlign: 'left',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <Text code style={{ color: '#cc4b4b', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                    {error.message}
                  </Text>
                </div>
              )}
              <Space size="middle">
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={() => window.location.reload()}
                  style={{
                    backgroundColor: '#2e7d32', // зеленый акцент
                    borderColor: '#2e7d32',
                    borderRadius: 30,
                    height: 44,
                    padding: '0 24px',
                    fontWeight: 500,
                  }}
                >
                  Перезагрузить
                </Button>
                <Button
                  onClick={this.resetError}
                  style={{
                    borderRadius: 30,
                    height: 44,
                    padding: '0 24px',
                    borderColor: '#ccc',
                    color: '#333',
                  }}
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