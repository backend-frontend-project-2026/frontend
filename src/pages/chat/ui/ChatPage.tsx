import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input, Button, Spin, Result, message } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { RoutePaths } from '@/app/router/routePaths';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { chatsApi } from '@/shared/api/services/chats';
import { getStoredUser } from '@/shared/api/auth/session';
import type { MessageResponse } from '@/shared/api/generated';
import styles from './ChatPage.module.css';

const { TextArea } = Input;

const POLLING_INTERVAL = 5000;

const ChatLoadingState = ({ className }: { className: string }) => (
  <div className={className}>
    <Spin size="large" />
  </div>
);

const ChatNotFound = ({ onBack }: { onBack: () => void }) => (
  <Result
    status="404"
    title="Чат не найден"
    subTitle="Возможно, ссылка устарела"
    extra={
      <Button type="primary" onClick={onBack}>
        К мэтчам
      </Button>
    }
  />
);

interface ChatContentProps {
  chatName: string;
  messages: MessageResponse[];
  currentProfileId: number | null;
  input: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  sending?: boolean;
  isPolling?: boolean;
}

const ChatContent = ({
  chatName,
  messages,
  currentProfileId,
  input,
  onInputChange,
  onSend,
  onBack,
  showBackButton = false,
  sending = false,
  isPolling = false,
}: ChatContentProps) => (
  <>
    <div className={styles.chat__header}>
      {showBackButton && onBack && <Button type="text" icon={<LeftOutlined />} onClick={onBack} />}
      <span>{chatName}</span>
      {isPolling && (
        <span className={styles.onlineIndicator} title="Обновляется в реальном времени">
          ●
        </span>
      )}
    </div>
    <div className={styles.chat__messages}>
      {messages.map((m) => (
        <div
          key={m.id}
          className={`${styles.msg} ${m.profile_id === currentProfileId ? styles.me : styles.them}`}
        >
          {m.content}
        </div>
      ))}
    </div>
    <div className={styles.chat__input}>
      <TextArea
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Сообщение..."
        autoSize={{ minRows: 1, maxRows: 4 }}
        disabled={sending}
        onPressEnter={(e) => {
          if (!e.shiftKey && !sending) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <Button type="primary" onClick={onSend} loading={sending} disabled={sending}>
        Отправить
      </Button>
    </div>
  </>
);

const ChatsPage = () => {
  const currentProfileId = useMemo(() => getStoredUser()?.id ?? null, []);

  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [chatName, setChatName] = useState('Чат');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadKey, setLoadKey] = useState(0);
  const [sending, setSending] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const isMobile = useIsMobile();

  const activeChatId = id != null ? Number(id) : null;
  const hasId = !!id;
  const showSidebar = !isMobile || !hasId;
  const showChat = !isMobile || hasId;

  useEffect(() => {
    if (!activeChatId) return;

    const controller = new AbortController();

    void Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        setLoading(true);
        setError(null);
        setChatName('Чат');
      }
    });

    Promise.all([
      chatsApi.getMessages(activeChatId, controller.signal),
      chatsApi.getChat(activeChatId, controller.signal),
    ])
      .then(([messagesData, chatData]) => {
        setMessages(messagesData?.items ?? []);
        // TODO: загрузить имя собеседника через GET /users/{id}/profile
        if (chatData?.profile_id) {
          setChatName(`Собеседник #${chatData.profile_id}`);
        }
      })
      .catch((err: Error) => {
        if (err.name !== 'AbortError') {
          setError('Не удалось загрузить чат');
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [activeChatId, loadKey]);

  useEffect(() => {
    if (!activeChatId) return;

    const interval = setInterval(async () => {
      setIsPolling(true);
      try {
        const data = await chatsApi.getMessages(activeChatId);
        const incomingMessages = data?.items ?? [];

        if (incomingMessages.length) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newItems = incomingMessages.filter((m) => !existingIds.has(m.id));
            return newItems.length ? [...prev, ...newItems] : prev;
          });
        }
      } catch {
        // Тихо игнорируем ошибки polling — не показываем error state при фоновом обновлении
      } finally {
        setIsPolling(false);
      }
    }, POLLING_INTERVAL);

    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [activeChatId]);

  // TODO: добавить пагинацию сообщений
  const sendMessage = async () => {
    if (!input.trim() || !activeChatId || !currentProfileId) return;

    try {
      setSending(true);
      const newMessage = await chatsApi.sendMessage({
        chat_id: activeChatId,
        profile_id: currentProfileId,
        content: input,
      });
      if (newMessage) {
        setMessages((prev) => [...prev, newMessage]);
      }
      setInput('');
    } catch {
      message.error('Не удалось отправить сообщение');
    } finally {
      setSending(false);
    }
  };

  const handleBackToList = () => {
    navigate(RoutePaths.MATCHES);
  };

  if (error) {
    return (
      <div className={isMobile ? styles.chatsMobile : styles.chats}>
        <Result
          status="error"
          title="Не удалось загрузить чат"
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

  // Десктоп
  if (!isMobile) {
    return (
      <div className={styles.chats}>
        <aside className={styles.chats__sidebar}>
          {/* TODO: загрузить список чатов через GET /chats */}
          <div className={styles.chats__title}>Чаты</div>
        </aside>
        <main className={styles.chat}>
          {!activeChatId ? (
            <ChatNotFound onBack={handleBackToList} />
          ) : loading ? (
            <ChatLoadingState className={styles.chat__empty} />
          ) : (
            <ChatContent
              chatName={chatName}
              messages={messages}
              currentProfileId={currentProfileId}
              input={input}
              onInputChange={setInput}
              onSend={sendMessage}
              sending={sending}
              isPolling={isPolling}
            />
          )}
        </main>
      </div>
    );
  }

  // Мобилка
  return (
    <div className={styles.chatsMobile}>
      {showSidebar && (
        <aside className={styles.chats__sidebar}>
          {/* TODO: загрузить список чатов через GET /chats */}
          <div className={styles.chats__title}>Чаты</div>
        </aside>
      )}
      {showChat && (
        <main className={styles.chatMobile}>
          {!activeChatId ? (
            <ChatNotFound onBack={handleBackToList} />
          ) : loading ? (
            <ChatLoadingState className={styles.chat__empty} />
          ) : (
            <ChatContent
              chatName={chatName}
              messages={messages}
              currentProfileId={currentProfileId}
              input={input}
              onInputChange={setInput}
              onSend={sendMessage}
              onBack={handleBackToList}
              showBackButton
              sending={sending}
              isPolling={isPolling}
            />
          )}
        </main>
      )}
    </div>
  );
};

export default ChatsPage;
