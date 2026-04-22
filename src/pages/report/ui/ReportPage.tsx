import { message } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';
import { getStoredUser } from '@/shared/api/auth/session';
import { complaintsApi } from '@/shared/api/services/complaints';
import { authApi } from '@/shared/api/services/auth';
import styles from './ReportPage.module.css';

const reasons = [
  'Спам',
  'Оскорбления',
  'Подозрительный профиль',
  'Несоответствие анкеты',
  'Другое',
];

const resolveRouteUserId = (value?: string): number | null => {
  if (!value) {
    return null;
  }

  if (/^\d+$/.test(value)) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  const match = value.match(/(\d+)$/);

  if (!match) {
    return null;
  }

  const parsed = Number(match[1]);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const ReportPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const storedUserId = getStoredUser()?.id ?? null;
  const routeUserId = userId;
  const reportedUserId = resolveRouteUserId(routeUserId);
  const hasValidReportedUser = reportedUserId !== null;

  const reportTargetLabel = hasValidReportedUser ? `на профиль #${routeUserId}` : 'на профиль';

  const missingTargetText = !hasValidReportedUser
    ? 'Жалобу можно отправить только из анкеты пользователя. Открой профиль и нажми «Пожаловаться».'
    : null;

  const canSubmit = Boolean(selected) && hasValidReportedUser && !isSubmitting;

  const resolveCurrentUserId = async (): Promise<number> => {
    if (storedUserId) {
      return storedUserId;
    }

    const me = await authApi.getMe();

    if (!me.id) {
      throw new Error('current_user_not_found');
    }

    return me.id;
  };

  const handleSubmit = async () => {
    if (!selected || reportedUserId === null || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const complainantId = await resolveCurrentUserId();

      await complaintsApi.create({
        complainant_id: complainantId,
        reported_user_id: reportedUserId,
        reason: selected,
      });

      setIsSubmitted(true);
    } catch {
      message.error('Не удалось отправить жалобу. Попробуй ещё раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (routeUserId) {
      navigate(RoutePaths.userProfile(routeUserId));
      return;
    }

    navigate(RoutePaths.DISCOVER);
  };

  const handleGoToDiscover = () => {
    navigate(RoutePaths.DISCOVER);
  };

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={`${styles.card} ${styles.successCard}`}>
          <span className={styles.successBadge}>✓</span>

          <h2 className={styles.title}>Жалоба отправлена</h2>

          <p className={styles.subtitle}>
            Спасибо. Модерация проверит обращение и примет решение по профилю.
          </p>

          <div className={styles.successDetails}>
            <span className={styles.successReasonLabel}>Причина</span>
            <strong>{selected ?? 'Не указана'}</strong>
            <span>Профиль: {reportTargetLabel}</span>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.secondary}`}
              onClick={handleBack}
            >
              Назад <span className={styles.arrow}>↗</span>
            </button>

            <button
              type="button"
              className={`${styles.btn} ${styles.primary}`}
              onClick={handleGoToDiscover}
            >
              В поиск <span className={styles.arrow}>↗</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Пожаловаться</h2>

        <p className={styles.subtitle}>
          Выбери причину жалобы {reportTargetLabel} — мы проверим и поможем.
        </p>

        <div className={styles.radioGroup}>
          {reasons.map((reason) => (
            <label key={reason} className={styles.radioItem}>
              <input
                type="radio"
                checked={selected === reason}
                onChange={() => setSelected(reason)}
                disabled={isSubmitting}
              />
              <span>{reason}</span>
            </label>
          ))}
        </div>

        <div className={styles.infoBox}>
          {missingTargetText ??
            'Жалоба не видна другой стороне. После отправки обращение уйдёт на проверку модерации.'}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.secondary}`}
            onClick={handleBack}
            disabled={isSubmitting}
          >
            Назад <span className={styles.arrow}>↗</span>
          </button>

          <button
            type="button"
            className={`${styles.btn} ${styles.primary}`}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Отправка…' : 'Отправить'} <span className={styles.arrow}>↗</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
