import './onboarding-progress.css';
import { Typography } from 'antd';
import type { OnboardingProgressStep, OnboardingStepId } from '../types';
import { DEFAULT_ONBOARDING_PROGRESS_STEPS } from '../constants';

const { Title } = Typography;

type OnboardingProgressProps = {
  currentStep: OnboardingStepId;
  steps?: OnboardingProgressStep[];
};

export function OnboardingProgress({
  currentStep,
  steps = DEFAULT_ONBOARDING_PROGRESS_STEPS,
}: OnboardingProgressProps) {
  const currentLabel = steps.find((step) => step.id === currentStep)?.label ?? '';
  const progressFillClassName = `rm-progress__bar-fill rm-progress__bar-fill--step-${currentStep}`;

  return (
    <section className="rm-progress" aria-label="Прогресс онбординга">
      <div className="rm-progress__top">
        <div className="rm-progress__heading">
          <Title level={2} className="rm-progress__title">
            Онбординг
          </Title>
          <span className="rm-progress__count">
            {currentStep}/{steps.length}
          </span>
        </div>

        <p className="rm-progress__meta">
          Шаг {currentStep} из {steps.length} • {currentLabel}
        </p>
      </div>

      <div className="rm-progress__bar" aria-hidden="true">
        <span className={progressFillClassName} />
      </div>

      <ol className="rm-progress__chips">
        {steps.map((step) => {
          const isActive = step.id === currentStep;

          return (
            <li key={step.id} className="rm-progress__chip-item">
              <span
                className={['rm-progress__chip', isActive ? 'is-active' : ''].join(' ')}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className="rm-progress__chip-dot" />
                <span className="rm-progress__chip-text">{step.label}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
