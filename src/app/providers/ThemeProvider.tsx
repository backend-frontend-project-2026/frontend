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
          borderRadius: 8,
          borderRadiusLG: 12,
          borderRadiusSM: 6,
        },
        components: {
          Button: {
            borderRadius: 999,
            borderRadiusLG: 999,
            borderRadiusSM: 999,
          },
          Input: {
            borderRadius: 999,
            borderRadiusLG: 999,
            borderRadiusSM: 999,
            activeBorderColor: 'var(--color-accent)',
            hoverBorderColor: 'var(--color-accent)',
            colorBorder: 'var(--color-bg-input-border)',
            lineWidth: 1.5,
          },
          Card: {
            borderRadiusLG: 16,
          },
          Typography: {
            titleMarginBottom: 0,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;
