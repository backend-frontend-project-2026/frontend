import { useNavigate } from 'react-router-dom';
import { Tag } from 'antd';
import RoundedButton from '@/shared/ui/RoundedButton/RoundedButton';
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
              <Tag
                key={label}
                style={{
                  borderRadius: 999,
                  padding: '4px 12px',
                  fontSize: 14,
                  color: 'var(--color-dark)',
                  border: active
                    ? '1.5px solid var(--color-accent)'
                    : '1.5px solid var(--color-divider)',
                  background: active ? 'var(--color-accent)' : 'var(--color-white)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'default',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: active
                      ? 'var(--color-success)'
                      : 'var(--color-text-secondary)',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                {label}
              </Tag>
            ))}
          </div>

          <div className={styles.buttons}>
            <RoundedButton variant="dark" onClick={() => navigate(RoutePaths.AUTH)}>
              Найти соседа
            </RoundedButton>
            <RoundedButton variant="gray" onClick={scrollToHowItWorks}>
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
