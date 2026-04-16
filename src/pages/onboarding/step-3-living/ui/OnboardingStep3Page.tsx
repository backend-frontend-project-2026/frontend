import {
  EditLivingPreferences,
  isLivingStepComplete,
  type LivingPreferencesFormValue,
} from '../../../../features/onboarding';
import { OnboardingProgress } from '../../../../widgets/onboarding-progress';
import '../../onboarding-pages.css';
import './onboarding-step-3-page.css';
import { useOnboardingLeaveGuard } from '../../lib/useOnboardingLeaveGuard';

type OnboardingStep3PageProps = {
  value?: Partial<LivingPreferencesFormValue>;
  onBack: () => void;
  onChange: (value: LivingPreferencesFormValue) => void;
  onSkip?: () => void;
  onNext: (value: LivingPreferencesFormValue) => void;
};

const FORM_ID = 'roomie-step-3-form';

export function OnboardingStep3Page({
  value,
  onBack,
  onChange,
  onSkip,
  onNext,
}: OnboardingStep3PageProps) {
  const shouldWarnOnLeave = !isLivingStepComplete(value);
  const confirmLeave = useOnboardingLeaveGuard(shouldWarnOnLeave);
  return (
    <section className="onboarding-page onboarding-page--step-3">
      <OnboardingProgress currentStep={3} />

      <EditLivingPreferences
        formId={FORM_ID}
        initialValue={value}
        onBack={() => confirmLeave(onBack)}
        onChange={onChange}
        onSkip={onSkip ? () => confirmLeave(onSkip) : undefined}
        onNext={onNext}
        hideHeader
        hideActions={false}
      />
    </section>
  );
}
