import { EditHabits, type HabitsFormValue } from '../../../../features/onboarding';
import { OnboardingProgress } from '../../../../widgets/onboarding-progress';
import './onboarding-step-2-page.css';

type OnboardingStep2PageProps = {
  value?: Partial<HabitsFormValue>;
  onBack: () => void;
  onNext: (value: HabitsFormValue) => void;
};

const FORM_ID = 'roomie-step-2-form';

export function OnboardingStep2Page({ value, onBack, onNext }: OnboardingStep2PageProps) {
  return (
    <section className="onboarding-page onboarding-page--step-2">
      <OnboardingProgress currentStep={2} />

      <EditHabits
        formId={FORM_ID}
        initialValue={value}
        onBack={onBack}
        onNext={onNext}
        hideHeader
        hideActions={false}
      />
    </section>
  );
}
