import { EditBasicInfo, type BasicInfoFormValue } from '../../../../features/onboarding';
import { OnboardingProgress } from '../../../../widgets/onboarding-progress';
import './onboarding-step-1-page.css';

type OnboardingStep1PageProps = {
  value?: Partial<BasicInfoFormValue>;
  onBack?: () => void;
  onNext: (value: BasicInfoFormValue) => void;
};

const FORM_ID = 'roomie-step-1-form';

export function OnboardingStep1Page({ value, onBack, onNext }: OnboardingStep1PageProps) {
  const formKey = JSON.stringify(value ?? {});

  return (
    <section className="onboarding-page onboarding-page--step-1">
      <OnboardingProgress currentStep={1} />

      <EditBasicInfo
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
