import styles from './MatchesPage.module.css';

type Match = {
  id: string;
  name: string;
  age: number;
  lastMessage: string;
  time: string;
};

const mockMatches: Match[] = [
  {
    id: '1',
    name: 'Катя',
    age: 20,
    lastMessage: 'Совпадение! Начать чат?',
    time: '12:24',
  },
  {
    id: '2',
    name: 'Илья',
    age: 21,
    lastMessage: 'Ок, договорились',
    time: '12:24',
  },
  {
    id: '3',
    name: 'Маша',
    age: 19,
    lastMessage: 'Когда тебе удобно созвониться?',
    time: '12:24',
  },
  {
    id: '4',
    name: 'Артём',
    age: 22,
    lastMessage: 'Есть вопросы по бюджету',
    time: '12:24',
  },
];

const MatchesPage = () => {
  const matches = mockMatches;
  const hasMatches = matches.length > 0;

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.header}>
          <h1 className={styles.title}>Мэтчи</h1>

          <input className={styles.search} placeholder="Поиск..." />
        </div>

        {hasMatches ? (
          <div className={styles.list}>
            {matches.map((m) => (
              <div key={m.id} className={styles.card}>
                <div className={styles.avatar} />

                <div className={styles.info}>
                  <div className={styles.topRow}>
                    <span className={styles.name}>
                      {m.name}, {m.age}
                    </span>
                    <span className={styles.time}>{m.time}</span>
                  </div>

                  <div className={styles.message}>{m.lastMessage}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyBox} />
            <p className={styles.emptyTitle}>Пока нет мэтчей</p>
            <p className={styles.emptyText}>Продолжай лайкать — они появятся 💛</p>
          </div>
        )}
      </div>

      <div className={styles.right}>
        <div className={styles.preview}>
          <div className={styles.previewBox} />
          <h3>Выбери мэтч слева</h3>
          <p>Тут появится переписка и быстрые действия</p>

          <button className={styles.primaryBtn}>Открыть чат</button>
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;
