import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { RoutePaths } from '@/app/router/routePaths';
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

const ChatsPage = () => {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showChat, setShowChat] = useState(false);

  const activeChatId = Number(id);
  const activeChat = chats.find((c) => c.id === activeChatId);

  // Отслеживание изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        // На десктопе показываем и сайдбар, и чат
        setShowSidebar(true);
        setShowChat(true);
      } else {
        // На мобилке: если есть активный чат, показываем только чат, иначе список
        if (activeChat) {
          setShowSidebar(false);
          setShowChat(true);
        } else {
          setShowSidebar(true);
          setShowChat(false);
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeChat]);

  const handleSelectChat = (chatId: number) => {
    navigate(`${RoutePaths.CHATS}/${chatId}`);
    if (isMobile) {
      setShowSidebar(false);
      setShowChat(true);
    }
  };

  const handleBackToList = () => {
    navigate(RoutePaths.CHATS); // убираем id из URL
    if (isMobile) {
      setShowSidebar(true);
      setShowChat(false);
    }
  };

  const sendMessage = () => {
    if (!input.trim() || !activeChat) return;
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

  const { TextArea } = Input;

  // Десктопная версия — показываем сайдбар и чат одновременно
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
                onClick={() => navigate(`${RoutePaths.CHATS}/${chat.id}`)}
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
          {!activeChat ? (
            <div className={styles.chat__empty}>Выберите чат</div>
          ) : (
            <>
              <div className={styles.chat__header}>{activeChat.name}</div>
              <div className={styles.chat__messages}>
                {activeChat.messages.map((m) => (
                  <div key={m.id} className={`${styles.msg} ${m.fromMe ? styles.me : styles.them}`}>
                    {m.text}
                  </div>
                ))}
              </div>
              <div className={styles.chat__input}>
                <TextArea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Сообщение..."
                  autoSize={{ minRows: 1, maxRows: 4 }}
                />
                <Button type="primary" onClick={sendMessage}>
                  Отпр
                </Button>
              </div>
            </>
          )}
        </main>
      </div>
    );
  }

  // Мобильная версия — показываем либо сайдбар, либо чат
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

      {showChat && activeChat && (
        <main className={styles.chatMobile}>
          <div className={styles.chat__header}>
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={handleBackToList}
              style={{ marginRight: 8 }}
            />
            {activeChat.name}
          </div>
          <div className={styles.chat__messages}>
            {activeChat.messages.map((m) => (
              <div key={m.id} className={`${styles.msg} ${m.fromMe ? styles.me : styles.them}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className={styles.chat__input}>
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Сообщение..."
              autoSize={{ minRows: 1, maxRows: 4 }}
            />
            <Button type="primary" onClick={sendMessage}>
              Отпр
            </Button>
          </div>
        </main>
      )}
    </div>
  );
};

export default ChatsPage;