import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input, Button, Spin, Result } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { RoutePaths } from '@/app/router/routePaths';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import styles from './ChatPage.module.css';

type Message = {
  id: number;
  text: string;
  fromMe: boolean;
};

type Chat = {
  id: number;
  name: string;
  messages: Message[];
};

// TODO: заменить на API когда бэкенд добавит GET /chats/:id
const mockChats: Chat[] = [
  {
    id: 1,
    name: 'Катя, 20',
    messages: [
      { id: 1, text: 'Привет! Видела твою анкету 😌', fromMe: false },
      { id: 2, text: 'Привет! Да, супер. Во сколько обычно ложишься?', fromMe: true },
      { id: 3, text: 'Около 23:30. А ты?', fromMe: false },
    ],
  },
  {
    id: 2,
    name: 'Оля, 19',
    messages: [{ id: 1, text: 'Привет! Договоримся о проживании?', fromMe: false }],
  },
];

const { TextArea } = Input;

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
  chat: Chat;
  input: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

const ChatContent = ({
  chat,
  input,
  onInputChange,
  onSend,
  onBack,
  showBackButton = false,
}: ChatContentProps) => (
  <>
    <div className={styles.chat__header}>
      {showBackButton && onBack && (
        <Button type="text" icon={<LeftOutlined />} onClick={onBack} />
      )}
      {chat.name}
    </div>
    <div className={styles.chat__messages}>
      {chat.messages.map((m) => (
        <div
          key={m.id}
          className={`${styles.msg} ${m.fromMe ? styles.me : styles.them}`}
        >
          {m.text}
        </div>
      ))}
    </div>
    <div className={styles.chat__input}>
      <TextArea
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Сообщение..."
        autoSize={{ minRows: 1, maxRows: 4 }}
        onPressEnter={(e) => {
          if (!e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <Button type="primary" onClick={onSend}>
        Отправить
      </Button>
    </div>
  </>
);

const ChatsPage = () => {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const isMobile = useIsMobile();

  const activeChatId = id != null ? Number(id) : null;

  // TODO: заменить на API — GET /chats/:id/messages
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeChatId]);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const hasId = !!id;
  const showSidebar = !isMobile || !hasId;
  const showChat = !isMobile || hasId;

  const sendMessage = () => {
    if (!input.trim() || !activeChat || activeChatId == null) return;
    const newMessage: Message = {
      id: Date.now(),
      text: input,
      fromMe: true,
    };
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId ? { ...chat, messages: [...chat.messages, newMessage] } : chat
      )
    );
    setInput('');
  };

  const handleSelectChat = (chatId: number) => {
    navigate(`${RoutePaths.CHATS}/${chatId}`);
  };

  const handleBackToList = () => {
    navigate(RoutePaths.MATCHES);
  };

  // Десктоп
  if (!isMobile) {
    return (
      <div className={styles.chats}>
        <aside className={styles.chats__sidebar}>
          <div className={styles.chats__title}>Чаты</div>
          <div className={styles.chats__list}>
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`${styles.chatItem} ${chat.id === activeChatId ? styles.active : ''}`}
                onClick={() => handleSelectChat(chat.id)}
              >
                <div className={styles.chatItem__avatar} />
                <div>
                  <div className={styles.chatItem__name}>{chat.name}</div>
                  <div className={styles.chatItem__last}>{chat.messages.at(-1)?.text}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>
        <main className={styles.chat}>
          {loading ? (
            <ChatLoadingState className={styles.chat__empty} />
          ) : !activeChat ? (
            <ChatNotFound onBack={handleBackToList} />
          ) : (
            <ChatContent
              chat={activeChat}
              input={input}
              onInputChange={setInput}
              onSend={sendMessage}
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
          <div className={styles.chats__title}>Чаты</div>
          <div className={styles.chats__list}>
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={styles.chatItem}
                onClick={() => handleSelectChat(chat.id)}
              >
                <div className={styles.chatItem__avatar} />
                <div>
                  <div className={styles.chatItem__name}>{chat.name}</div>
                  <div className={styles.chatItem__last}>{chat.messages.at(-1)?.text}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}
      {showChat && (
        <main className={styles.chatMobile}>
          {loading ? (
            <ChatLoadingState className={styles.chat__empty} />
          ) : !activeChat ? (
            <ChatNotFound onBack={handleBackToList} />
          ) : (
            <ChatContent
              chat={activeChat}
              input={input}
              onInputChange={setInput}
              onSend={sendMessage}
              onBack={handleBackToList}
              showBackButton
            />
          )}
        </main>
      )}
    </div>
  );
};

export default ChatsPage;
