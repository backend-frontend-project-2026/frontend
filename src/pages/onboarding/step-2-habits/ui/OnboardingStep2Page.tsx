import { EditHabits, type HabitsFormValue } from '../../../../features/onboarding';
import { OnboardingProgress } from '../../../../widgets/onboarding-progress';
import '../../onboarding-pages.css';
import './onboarding-step-2-page.css';

type OnboardingStep2PageProps = {
  value?: Partial<HabitsFormValue>;
  onBack: () => void;
  onChange: (value: HabitsFormValue) => void;
  onSkip?: () => void;
  onNext: (value: HabitsFormValue) => void;
};

const FORM_ID = 'roomie-step-2-form';

export function OnboardingStep2Page({
  value,
  onBack,
  onChange,
  onSkip,
  onNext,
}: OnboardingStep2PageProps) {
  const formKey = JSON.stringify(value ?? {});

  return (
    <section className="onboarding-page onboarding-page--step-2">
      <OnboardingProgress currentStep={2} />

      <EditHabits
        key={formKey}
        formId={FORM_ID}
        initialValue={value}
        onBack={onBack}
        onChange={onChange}
        onSkip={onSkip}
        onNext={onNext}
        hideHeader
        hideActions={false}
      />
    </section>
  );
}
