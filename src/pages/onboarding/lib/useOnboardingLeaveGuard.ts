import { useCallback } from 'react';
import { Modal } from 'antd';
import { useBeforeUnload } from 'react-router-dom';

const LEAVE_MESSAGE =
  'Анкета заполнена не до конца. Уйти со страницы и потерять незавершённые изменения?';

const LEAVE_MODAL_TITLE = 'Уйти со страницы?';

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

      if (!shouldWarn) {
        action();
        return;
      }

      Modal.confirm({
        title: LEAVE_MODAL_TITLE,
        content: LEAVE_MESSAGE,
        okText: 'Уйти',
        cancelText: 'Остаться',
        centered: true,
        okButtonProps: {
          danger: true,
        },
        onOk: action,
      });
    },
    [shouldWarn]
  );
}