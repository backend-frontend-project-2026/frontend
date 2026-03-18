import { useNavigate } from 'react-router-dom';
import RoundedButton from '@/shared/ui/RoundedButton/RoundedButton';
import ArrowUpRightIcon from '@/assets/icons/arrow-up-right.svg?react';
import HabitTag from '@/shared/ui/HabitTag/HabitTag';
import { RoutePaths } from '@/app/router/routePaths';
import styles from './LandingPage.module.css';

const badges = [
  { label: 'По привычкам', active: true },
  { label: 'Безопасно', active: true },
  { label: 'Студентам', active: false },
];

const previewTags = ['Тишина', 'Не курю', 'Аккуратно', 'Гости редко'];

const howItWorksCards = [
  {
    title: 'Как работает',
    text: 'Анкета → лайки → взаимный мэтч → чат. Всё просто.',
  },
  {
    title: 'Фильтры',
    text: 'Бюджет, дата заезда, «тихие часы», курение, гости и другое.',
  },
  {
    title: 'Безопасность',
    text: 'Жалоба и блокировка, спокойные подсказки, контроль приватности.',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.h1}>Подберём соседа по привычкам</h1>
          <p className={styles.subtitle}>
            Анкета, фильтры, лайки и чат — внутри студенческого сообщества. Дружелюбно и безопасно.
          </p>

          <div className={styles.badges}>
            {badges.map(({ label, active }) => (
              <span
                key={label}
                className={`${styles.badge} ${active ? styles.badgeActive : ''}`}
              >
                <span className={styles.dot} />
                {label}
              </span>
            ))}
          </div>

          <div className={styles.buttons}>
            <RoundedButton
              type="primary"
              onClick={() => navigate(RoutePaths.AUTH)}
              className={styles.buttonPrimary}
              icon={
                <span className={`${styles.iconCircle} ${styles.iconCircleLight}`}>
                  <ArrowUpRightIcon />
                </span>
              }
            >
              Найти соседа
            </RoundedButton>
            <RoundedButton
              onClick={scrollToHowItWorks}
              className={styles.buttonSecondary}
              icon={
                <span className={`${styles.iconCircle} ${styles.iconCircleDark}`}>
                  <ArrowUpRightIcon />
                </span>
              }
            >
              Как работает
            </RoundedButton>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.previewCard}>
            <div className={styles.previewPhoto} />
            <p className={styles.previewName}>Катя, 20</p>
            <p className={styles.previewLocation}>КФУ • Приволжский район</p>
            <div className={styles.previewTags}>
              {previewTags.map((tag) => (
                <HabitTag key={tag} label={tag} readonly />
              ))}
            </div>
            <p className={styles.previewBio}>
              Ищу спокойную соседку. Учусь, люблю порядок и тихие вечера.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.howItWorksInner}>
          <div className={styles.cards}>
            {howItWorksCards.map(({ title, text }) => (
              <div key={title} className={styles.card}>
                <p className={styles.cardTitle}>{title}</p>
                <p className={styles.cardText}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
