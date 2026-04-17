import {
  EditInterests,
  isInterestsStepComplete,
  type InterestsFormValue,
} from '../../../../features/onboarding';
import '../../onboarding-pages.css';
import { OnboardingProgress } from '../../../../widgets/onboarding-progress';
import './onboarding-step-4-page.css';
import { useOnboardingLeaveGuard } from '../../lib/useOnboardingLeaveGuard';

type OnboardingStep4PageProps = {
  value?: Partial<InterestsFormValue>;
  onBack: () => void;
  onChange: (value: InterestsFormValue) => void;
  onSkip?: () => void;
  onComplete: (value: InterestsFormValue) => void;
};

const FORM_ID = 'roomie-step-4-form';

export function OnboardingStep4Page({
  value,
  onBack,
  onChange,
  onSkip,
  onComplete,
}: OnboardingStep4PageProps) {
  const shouldWarnOnLeave = !isInterestsStepComplete(value);
  const confirmLeave = useOnboardingLeaveGuard(shouldWarnOnLeave);
  return (
    <section className="onboarding-page onboarding-page--step-4">
      <OnboardingProgress currentStep={4} />

      <EditInterests
        formId={FORM_ID}
        initialValue={value}
        onBack={() => confirmLeave(onBack)}
        onChange={onChange}
        onSkip={onSkip ? () => confirmLeave(onSkip) : undefined}
        onNext={onComplete}
        hideHeader
        hideActions={false}
      />
    </section>
  );
}
