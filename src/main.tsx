import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@/app/styles/index.css';
import '@/pages/onboarding/onboarding-pages.css';
import App from './App.tsx';
import 'antd/dist/reset.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
