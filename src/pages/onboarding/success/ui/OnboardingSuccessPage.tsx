import { useEffect } from 'react';
import { Button, Typography } from 'antd';
import '../../onboarding-pages.css';
import './onboarding-success-page.css';

const { Title } = Typography;

type OnboardingSuccessPageProps = {
  onContinue: () => void;
};

export function OnboardingSuccessPage({ onContinue }: OnboardingSuccessPageProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onContinue();
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [onContinue]);

  return (
    <section className="onboarding-page onboarding-page--success">
      <div className="rm-form-card onboarding-success-card">
        <div className="onboarding-success-badge" aria-hidden="true">
          ✓
        </div>

        <div className="rm-form-head onboarding-success-head">
          <p className="rm-form-step">Готово</p>
          <Title level={3} className="rm-form-title">
            Онбординг успешно завершён
          </Title>
          <p className="rm-form-description">Анкета сохранена. Сейчас откроется discover.</p>
        </div>

        <p className="onboarding-success-text">Можно подождать пару секунд или перейти сразу.</p>

        <Button
          htmlType="button"
          className="rm-nav-button rm-nav-button--primary onboarding-success-button"
          onClick={onContinue}
        >
          <span>Перейти в discover</span>
          <span className="rm-nav-button__icon rm-nav-button__icon--lime">↗</span>
        </Button>
      </div>
    </section>
  );
}
