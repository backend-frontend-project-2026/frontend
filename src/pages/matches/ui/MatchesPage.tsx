import { useNavigate } from 'react-router-dom';
import styles from './MatchesPage.module.css';
import { List, Avatar, Empty, Input, Button } from 'antd';

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
  const matches = mockMatches;

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.header}>
          <h1 className={styles.title}>Мэтчи</h1>

          <Input className={styles.search} placeholder="Поиск..." />
        </div>

        <List
          className={styles.list}
          dataSource={matches}
          locale={{
            emptyText: <Empty description="Пока нет мэтчей" />,
          }}
          renderItem={(m) => (
            <List.Item
              key={m.id}
              onClick={() => navigate(`/chat/${m.id}`)}
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

          <Button type="primary" onClick={() => matches[0] && navigate(`/chat/${matches[0].id}`)}>
            Открыть чат
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;
