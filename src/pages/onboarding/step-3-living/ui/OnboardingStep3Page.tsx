import {
  EditLivingPreferences,
  type LivingPreferencesFormValue,
} from '../../../../features/onboarding';
import { OnboardingProgress } from '../../../../widgets/onboarding-progress';
import './onboarding-step-3-page.css';

type OnboardingStep3PageProps = {
  value?: Partial<LivingPreferencesFormValue>;
  onBack: () => void;
  onNext: (value: LivingPreferencesFormValue) => void;
};

const FORM_ID = 'roomie-step-3-form';

export function OnboardingStep3Page({ value, onBack, onNext }: OnboardingStep3PageProps) {
  const formKey = JSON.stringify(value ?? {});

  return (
    <section className="onboarding-page onboarding-page--step-3">
      <OnboardingProgress currentStep={3} />

      <EditLivingPreferences
        key={formKey}
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
