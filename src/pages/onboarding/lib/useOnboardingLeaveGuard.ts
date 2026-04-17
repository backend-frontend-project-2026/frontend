import { useCallback } from 'react';
import { useBeforeUnload } from 'react-router-dom';

const LEAVE_MESSAGE =
  'Анкета заполнена не до конца. Уйти со страницы и потерять незавершённые изменения?';

export function useOnboardingLeaveGuard(shouldWarn: boolean) {
  useBeforeUnload(
    useCallback(
      (event) => {
        if (!shouldWarn) {
          return;
        }

        event.preventDefault();
        event.returnValue = '';
      },
      [shouldWarn]
    )
  );

  return useCallback(
    (action?: () => void) => {
      if (!action) {
        return;
      }

      if (!shouldWarn || window.confirm(LEAVE_MESSAGE)) {
        action();
      }
    },
    [shouldWarn]
  );
}
