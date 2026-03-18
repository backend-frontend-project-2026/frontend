import { ConfigProvider } from 'antd';
import type { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#DFFF4F',
          colorTextLightSolid: '#232427',
          colorBgLayout: '#F5F6FA',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        },
        components: {
          Button: {
            borderRadius: 999,
            borderRadiusLG: 999,
            borderRadiusSM: 999,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;
