import './onboarding-progress.css';

export type OnboardingStepId = 1 | 2 | 3 | 4;

export type OnboardingProgressStep = {
  id: OnboardingStepId;
  label: string;
};

type OnboardingProgressProps = {
  currentStep: OnboardingStepId;
  steps?: OnboardingProgressStep[];
};

const defaultSteps: OnboardingProgressStep[] = [
  { id: 1, label: 'Профиль' },
  { id: 2, label: 'Привычки' },
  { id: 3, label: 'Условия' },
  { id: 4, label: 'Интересы' },
];

export function OnboardingProgress({ currentStep, steps = defaultSteps }: OnboardingProgressProps) {
  const currentLabel = steps.find((step) => step.id === currentStep)?.label ?? '';
  const progressPercent = (currentStep / steps.length) * 100;

  return (
    <section className="rm-progress" aria-label="Прогресс онбординга">
      <div className="rm-progress__top">
        <div className="rm-progress__heading">
          <h2 className="rm-progress__title">Онбординг</h2>
          <span className="rm-progress__count">
            {currentStep}/{steps.length}
          </span>
        </div>

        <p className="rm-progress__meta">
          Шаг {currentStep} из {steps.length} • {currentLabel}
        </p>
      </div>

      <div className="rm-progress__bar" aria-hidden="true">
        <span className="rm-progress__bar-fill" style={{ width: `${progressPercent}%` }} />
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
