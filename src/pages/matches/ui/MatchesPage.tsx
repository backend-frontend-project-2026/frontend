import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MatchesPage.module.css';
import { List, Avatar, Empty, Input, Button, Spin, Result, Tooltip } from 'antd';
import { RoutePaths } from '@/app/router/routePaths';
import { matchesApi } from '@/shared/api/services/matches';
import { profilesApi } from '@/shared/api/services/profiles';
import { getStoredUser } from '@/shared/api/auth/session';
import type { MatchItem } from '@/shared/api/generated';

const MatchesPage = () => {
  const navigate = useNavigate();
  const [currentProfileId, setCurrentProfileId] = useState<number | null>(null);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [fetchState, setFetchState] = useState<{ loading: boolean; error: string | null }>({
    loading: !!currentProfileId,
    error: null,
  });
  const [loadKey, setLoadKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const currentUserId = getStoredUser()?.id;

    if (!currentUserId) {
      setCurrentProfileId(null);
      setFetchState({ loading: false, error: null });
      return;
    }

    setFetchState({ loading: true, error: null });

    profilesApi
      .getByUserId(currentUserId)
      .then((result) => {
        setCurrentProfileId(result.data?.id ?? null);
      })
      .catch(() => {
        setCurrentProfileId(null);
        setFetchState({ loading: false, error: 'Не удалось загрузить профиль пользователя' });
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void Promise.resolve().then(() => {
      if (controller.signal.aborted) return;

      if (!currentProfileId) {
        setMatches([]);
        setFetchState({ loading: false, error: null });
        return;
      }

      setFetchState({ loading: true, error: null });
    });

    if (!currentProfileId) {
      return () => controller.abort();
    }

    matchesApi
      .getMatches(currentProfileId, controller.signal)
      .then((data) => {
        setMatches(data?.items ?? []);
      })
      .catch((err: Error) => {
        if (err.name !== 'AbortError') {
          setFetchState({ loading: false, error: 'Не удалось загрузить мэтчи' });
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setFetchState((s) => ({ ...s, loading: false }));
        }
      });

    return () => controller.abort();
  }, [currentProfileId, loadKey]);

  if (fetchState.loading) {
    return (
      <div className={styles.page}>
        <div className={styles.spinnerWrapper}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (fetchState.error) {
    return (
      <div className={styles.page}>
        <Result
          status="error"
          title="Не удалось загрузить мэтчи"
          subTitle={fetchState.error}
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
            <Tooltip title={!m.chat_id ? 'Чат ещё не создан' : ''}>
              <List.Item
                key={m.id}
                onClick={() => m.chat_id && navigate(`${RoutePaths.CHATS}/${m.chat_id}`)}
                style={{ cursor: m.chat_id ? 'pointer' : 'default' }}
              >
                <List.Item.Meta
                  avatar={<Avatar />}
                  title={
                    <span className={styles.name}>
                      {m.name}, {m.age}
                    </span>
                  }
                />
              </List.Item>
            </Tooltip>
          )}
        />
      </div>

      <div className={styles.right}>
        <div className={styles.preview}>
          <div className={styles.previewBox} />
          <h3>Выбери мэтч слева</h3>
          <p>Тут появится переписка и быстрые действия</p>

          <Tooltip title={!filteredMatches[0]?.chat_id ? 'Чат ещё не создан' : ''}>
            <Button
              type="primary"
              disabled={!filteredMatches[0]?.chat_id}
              onClick={() =>
                filteredMatches[0]?.chat_id &&
                navigate(`${RoutePaths.CHATS}/${filteredMatches[0].chat_id}`)
              }
            >
              Открыть чат
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;
