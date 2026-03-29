import { EditInterests, type InterestsFormValue } from '../../../../features/onboarding';
import { OnboardingProgress } from '../../../../widgets/onboarding-progress';
import './onboarding-step-4-page.css';

type OnboardingStep4PageProps = {
  value?: Partial<InterestsFormValue>;
  onBack: () => void;
  onComplete: (value: InterestsFormValue) => void;
};

const FORM_ID = 'roomie-step-4-form';

export function OnboardingStep4Page({ value, onBack, onComplete }: OnboardingStep4PageProps) {
  const formKey = JSON.stringify(value ?? {});

  return (
    <section className="onboarding-page onboarding-page--step-4">
      <OnboardingProgress currentStep={4} />

      <EditInterests
        key={formKey}
        formId={FORM_ID}
        initialValue={value}
        onBack={onBack}
        onNext={onComplete}
        hideHeader
        hideActions={false}
      />
    </section>
  );
}
