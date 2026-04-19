import {
  EditHabits,
  isHabitsStepComplete,
  type HabitsFormValue,
} from '../../../../features/onboarding';
import { OnboardingProgress } from '../../../../widgets/onboarding-progress';
import '../../onboarding-pages.css';
import './onboarding-step-2-page.css';
import { useOnboardingLeaveGuard } from '../../lib/useOnboardingLeaveGuard';

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
  const shouldWarnOnLeave = !isHabitsStepComplete(value);
  const confirmLeave = useOnboardingLeaveGuard(shouldWarnOnLeave);
  return (
    <section className="onboarding-page onboarding-page--step-2">
      <OnboardingProgress currentStep={2} />

      <EditHabits
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
