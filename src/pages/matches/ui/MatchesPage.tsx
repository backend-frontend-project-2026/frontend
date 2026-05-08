import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MatchesPage.module.css';
import { List, Avatar, Empty, Input, Button, Spin, Result } from 'antd';
import { RoutePaths } from '@/app/router/routePaths';

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
    lastMessage: 'Около 23:30. А ты?',
    time: '12:24',
  },
  {
    id: '2',
    name: 'Оля',
    age: 19,
    lastMessage: 'Привет! Договоримся о проживании?',
    time: '12:12',
  },
];

const MatchesPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadKey, setLoadKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const matches = mockMatches;

  useEffect(() => {
    let isMounted = true;

    void Promise.resolve().then(() => {
      if (isMounted) {
        setLoading(true);
        setError(null);
      }
    });

    const timer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
      // TODO: заменить на API когда бэкенд добавит GET /matches
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [loadKey]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.spinnerWrapper}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <Result
          status="error"
          title="Не удалось загрузить мэтчи"
          subTitle={error}
          extra={
            <Button type="primary" onClick={() => setLoadKey((k) => k + 1)}>
              Попробовать снова
            </Button>
          }
        />
      </div>
    );
  }

  const filteredMatches = matches.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.header}>
          <h1 className={styles.title}>Мэтчи</h1>

          <Input
            className={styles.search}
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
          />
        </div>

        <List
          className={styles.list}
          dataSource={filteredMatches}
          locale={{
            emptyText: (
              <Empty
                description={
                  searchQuery
                    ? `По запросу «${searchQuery}» ничего не найдено`
                    : 'Пока нет мэтчей. Ставьте лайки анкетам в Поиске!'
                }
              >
                {!searchQuery && (
                  <Button type="primary" onClick={() => navigate(RoutePaths.DISCOVER)}>
                    Перейти в Поиск
                  </Button>
                )}
              </Empty>
            ),
          }}
          renderItem={(m) => (
            <List.Item
              key={m.id}
              onClick={() => navigate(`${RoutePaths.CHATS}/${m.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <List.Item.Meta
                avatar={<Avatar />}
                title={
                  <div className={styles.topRow}>
                    <span className={styles.name}>
                      {m.name}, {m.age}
                    </span>
                    <span className={styles.time}>{m.time}</span>
                  </div>
                }
                description={<div className={styles.message}>{m.lastMessage}</div>}
              />
            </List.Item>
          )}
        />
      </div>

      <div className={styles.right}>
        <div className={styles.preview}>
          <div className={styles.previewBox} />
          <h3>Выбери мэтч слева</h3>
          <p>Тут появится переписка и быстрые действия</p>

          <Button
            type="primary"
            onClick={() =>
              filteredMatches[0] && navigate(`${RoutePaths.CHATS}/${filteredMatches[0].id}`)
            }
          >
            Открыть чат
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;
