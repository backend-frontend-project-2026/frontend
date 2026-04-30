import { message } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';
import { requireCurrentUserId } from '@/shared/api/auth/currentUser';
import { complaintsApi } from '@/shared/api/services/complaints';
import { blocksApi } from '@/shared/api/services/blocks';
import { resolveRouteUserId } from '@/shared/utils/route';
import styles from './ReportPage.module.css';

const reasons = [
  'Спам',
  'Оскорбления',
  'Подозрительный профиль',
  'Несоответствие анкеты',
  'Другое',
];

export const ReportPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const routeUserId = userId;
  const reportedUserId = resolveRouteUserId(routeUserId);
  const hasValidReportedUser = reportedUserId !== null;

  const reportTargetLabel = hasValidReportedUser ? `на профиль #${routeUserId}` : 'на профиль';

  const missingTargetText = !hasValidReportedUser
    ? 'Жалобу можно отправить только из анкеты пользователя. Откройте профиль и нажмите «Пожаловаться».'
    : null;

  const canSubmit = Boolean(selected) && hasValidReportedUser && !isSubmitting;
  const canBlock = hasValidReportedUser && !isBlocking && !isBlocked;

  const handleSubmit = async () => {
    if (!selected || reportedUserId === null || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const complainantId = await requireCurrentUserId();

      await complaintsApi.create({
        complainant_id: complainantId,
        reported_user_id: reportedUserId,
        reason: selected,
      });

      setIsSubmitted(true);
    } catch {
      message.error('Не удалось отправить жалобу. Попробуйте ещё раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlockUser = async () => {
    if (reportedUserId === null || isBlocking || isBlocked) {
      return;
    }

    try {
      setIsBlocking(true);

      const blockerUserId = await requireCurrentUserId();

      await blocksApi.block(reportedUserId, blockerUserId);

      setIsBlocked(true);
      message.success('Пользователь заблокирован');
    } catch {
      message.error('Не удалось заблокировать пользователя. Попробуйте ещё раз.');
    } finally {
      setIsBlocking(false);
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
            {isBlocked && <span>Пользователь заблокирован</span>}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.secondary}`}
              onClick={handleBack}
              disabled={isBlocking}
            >
              Назад <span className={styles.arrow}>↗</span>
            </button>

            <button
              type="button"
              className={`${styles.btn} ${styles.secondary}`}
              onClick={handleBlockUser}
              disabled={!canBlock}
            >
              {isBlocked ? 'Заблокирован' : isBlocking ? 'Блокировка…' : 'Заблокировать'}
              <span className={styles.arrow}>↗</span>
            </button>

            <button
              type="button"
              className={`${styles.btn} ${styles.primary}`}
              onClick={handleGoToDiscover}
              disabled={isBlocking}
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
            disabled={isSubmitting || isBlocking}
          >
            Назад <span className={styles.arrow}>↗</span>
          </button>

          <button
            type="button"
            className={`${styles.btn} ${styles.secondary}`}
            disabled={!canBlock || isSubmitting}
            onClick={handleBlockUser}
          >
            {isBlocked ? 'Заблокирован' : isBlocking ? 'Блокировка…' : 'Заблокировать'}
            <span className={styles.arrow}>↗</span>
          </button>

          <button
            type="button"
            className={`${styles.btn} ${styles.primary}`}
            disabled={!canSubmit || isBlocking}
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
