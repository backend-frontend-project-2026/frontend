import { useState } from 'react';
import styles from './ReportPage.module.css';

const reasons = [
  'Спам',
  'Оскорбления',
  'Подозрительный профиль',
  'Несоответствие анкеты',
  'Другое',
];

export const ReportPage = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmBlock, setConfirmBlock] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Пожаловаться</h2>
        <p className={styles.subtitle}>Выбери причину — мы проверим и поможем.</p>

        <div className={styles.radioGroup}>
          {reasons.map((reason) => (
            <label key={reason} className={styles.radioItem}>
              <input
                type="radio"
                checked={selected === reason}
                onChange={() => setSelected(reason)}
              />
              <span>{reason}</span>
            </label>
          ))}
        </div>

        <div className={styles.infoBox}>
          Жалоба не видна другой стороне. Можно также заблокировать — чат исчезнет.
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.secondary}`}
            onClick={() => setConfirmBlock(true)}
          >
            Заблокировать <span className={styles.arrow}>↗</span>
          </button>

          <button className={`${styles.btn} ${styles.primary}`} disabled={!selected}>
            Отправить <span className={styles.arrow}>↗</span>
          </button>
        </div>

        {confirmBlock && (
          <div className={styles.confirmBox}>
            <h3 className={styles.confirmTitle}>Подтвердить блокировку?</h3>

            <p className={styles.confirmText}>
              Профиль исчезнет из матчей и чатов. Это можно отменить в настройках.
            </p>

            <div className={styles.actions}>
              <button
                className={`${styles.btn} ${styles.secondary}`}
                onClick={() => setConfirmBlock(false)}
              >
                Отмена <span className={styles.arrow}>↗</span>
              </button>

              <button className={`${styles.btn} ${styles.primary}`}>
                Заблокировать <span className={styles.arrow}>↗</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
