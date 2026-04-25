import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@/app/styles/index.css';
import App from './App.tsx';
import 'antd/dist/reset.css';
import '@/shared/api/setup';
import ErrorBoundary from './app/providers/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
