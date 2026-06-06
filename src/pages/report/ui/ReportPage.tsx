import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { RoutePaths } from '@/app/router/routePaths';
import { requireCurrentUserId } from '@/shared/api/auth/currentUser';
import { blocksApi } from '@/shared/api/services/blocks';
import { complaintsApi } from '@/shared/api/services/complaints';
import { profilesApi } from '@/shared/api/services/profiles';
import { usersApi } from '@/shared/api/services/users';
import { resolveRouteUserId } from '@/shared/utils/route';
import styles from './ReportPage.module.css';

type ComplaintReasonValue = 'spam' | 'scam' | 'fake' | 'inappropriate_content' | 'other';

const reasons: Array<{ label: string; value: ComplaintReasonValue }> = [
  { label: 'Спам', value: 'spam' },
  { label: 'Мошенничество', value: 'scam' },
  { label: 'Фейковый профиль', value: 'fake' },
  { label: 'Неподходящий контент', value: 'inappropriate_content' },
  { label: 'Другое', value: 'other' },
];

type ReportLocationState = {
  reportedUserName?: unknown;
};

const getSafeName = (name: unknown): string | null => {
  if (typeof name !== 'string') {
    return null;
  }

  const trimmedName = name.trim();

  return trimmedName.length > 0 ? trimmedName : null;
};

const getUserFullName = (firstName?: string, lastName?: string): string | null => {
  const fullName = [firstName, lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ');

  return fullName || null;
};

export const ReportPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();

  const locationState = location.state as ReportLocationState | null;
  const locationReportedUserName = getSafeName(locationState?.reportedUserName);

  const [selected, setSelected] = useState<ComplaintReasonValue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [reportedUserName, setReportedUserName] = useState<string | null>(locationReportedUserName);
  const [isTargetLoading, setIsTargetLoading] = useState(false);
  const [targetLoadFailed, setTargetLoadFailed] = useState(false);

  const routeUserId = userId;
  const reportedUserId = resolveRouteUserId(routeUserId);
  const hasValidReportedUser = reportedUserId !== null;

  const reportTargetName = useMemo(() => {
    if (!hasValidReportedUser) {
      return 'Пользователь не выбран';
    }

    if (reportedUserName) {
      return reportedUserName;
    }

    if (isTargetLoading) {
      return 'Загрузка данных пользователя…';
    }

    return `Пользователь #${routeUserId}`;
  }, [hasValidReportedUser, isTargetLoading, reportedUserName, routeUserId]);

  const reportTargetLabel = hasValidReportedUser
    ? `на пользователя «${reportTargetName}»`
    : 'на пользователя';

  const targetHint =
    hasValidReportedUser && targetLoadFailed && !reportedUserName
      ? 'ФИ пользователя не загрузилось, поэтому показан ID.'
      : null;

  const missingTargetText = !hasValidReportedUser
    ? 'Жалобу можно отправить только из анкеты пользователя. Откройте профиль и нажмите «Пожаловаться».'
    : null;

  useEffect(() => {
    let isCancelled = false;

    const loadReportedUserName = async () => {
      setTargetLoadFailed(false);

      if (reportedUserId === null) {
        setReportedUserName(null);
        setIsTargetLoading(false);
        return;
      }

      setReportedUserName(locationReportedUserName);
      setIsTargetLoading(true);

      try {
        try {
          const user = await usersApi.getById(reportedUserId);

          if (isCancelled) {
            return;
          }

          const fullName = getUserFullName(user.first_name, user.last_name);

          if (fullName) {
            setReportedUserName(fullName);
            return;
          }
        } catch {
          // Если ФИ из /users/{id} не загрузилось, пробуем взять имя из профиля.
        }

        try {
          const result = await profilesApi.getByUserId(reportedUserId);

          if (isCancelled) {
            return;
          }

          const profileName = getSafeName(result.data?.name);

          if (profileName) {
            setReportedUserName(profileName);
            return;
          }
        } catch {
          // Если профиль тоже не загрузился, ниже покажем fallback с ID.
        }

        if (!isCancelled) {
          setTargetLoadFailed(true);
        }
      } finally {
        if (!isCancelled) {
          setIsTargetLoading(false);
        }
      }
    };

    void loadReportedUserName();

    return () => {
      isCancelled = true;
    };
  }, [locationReportedUserName, reportedUserId]);

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
    } catch (error) {
      console.error('Failed to block user', error);
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
            <strong>
              {reasons.find((reason) => reason.value === selected)?.label ?? 'Не указана'}
            </strong>
            <span>Пользователь: {reportTargetName}</span>
            {hasValidReportedUser && <span>ID пользователя: {routeUserId}</span>}
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

        <div className={styles.targetBox}>
          <span className={styles.targetLabel}>Жалоба на</span>
          <strong>{reportTargetName}</strong>
          {hasValidReportedUser && <span>ID пользователя: {routeUserId}</span>}
          {targetHint && <span className={styles.targetHint}>{targetHint}</span>}
        </div>

        <p className={styles.subtitle}>
          Выбери причину жалобы {reportTargetLabel} — мы проверим и поможем.
        </p>

        <div className={styles.radioGroup}>
          {reasons.map((reason) => (
            <label key={reason.value} className={styles.radioItem}>
              <input
                type="radio"
                checked={selected === reason.value}
                onChange={() => setSelected(reason.value)}
                disabled={isSubmitting}
              />
              <span>{reason.label}</span>
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
