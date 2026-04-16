import {
  EditBasicInfo,
  isBasicInfoStepComplete,
  type BasicInfoFormValue,
} from '../../../../features/onboarding';
import { OnboardingProgress } from '../../../../widgets/onboarding-progress';
import '../../onboarding-pages.css';
import './onboarding-step-1-page.css';
import { useOnboardingLeaveGuard } from '../../lib/useOnboardingLeaveGuard';

type OnboardingStep1PageProps = {
  value?: Partial<BasicInfoFormValue>;
  onBack?: () => void;
  onChange: (value: BasicInfoFormValue) => void;
  onSkip?: () => void;
  onNext: (value: BasicInfoFormValue) => void;
};

const FORM_ID = 'roomie-step-1-form';

export function OnboardingStep1Page({
  value,
  onBack,
  onChange,
  onSkip,
  onNext,
}: OnboardingStep1PageProps) {
  const shouldWarnOnLeave = !isBasicInfoStepComplete(value);
  const confirmLeave = useOnboardingLeaveGuard(shouldWarnOnLeave);
  return (
    <section className="onboarding-page onboarding-page--step-1">
      <OnboardingProgress currentStep={1} />

      <EditBasicInfo
        formId={FORM_ID}
        initialValue={value}
        onBack={onBack ? () => confirmLeave(onBack) : undefined}
        onChange={onChange}
        onSkip={onSkip ? () => confirmLeave(onSkip) : undefined}
        onNext={onNext}
        hideHeader
        hideActions={false}
      />
    </section>
  );
}
