import { useState } from 'react';
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
    name: 'Катя',
    messages: [
      { id: 1, text: 'Привет! Видела твою анкету 😌', fromMe: false },
      { id: 2, text: 'Привет! Да, супер. Во сколько обычно ложишься?', fromMe: true },
      { id: 3, text: 'Около 23:30. А ты?', fromMe: false },
    ],
  },
  {
    id: 2,
    name: 'Оля, 19',
    messages: [{ id: 1, text: 'Последнее сообщение...', fromMe: false }],
  },
];

const ChatsPage = () => {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeChatId, setActiveChatId] = useState<number>(1);
  const [input, setInput] = useState('');

  const activeChat = chats.find((c) => c.id === activeChatId)!;

  const sendMessage = () => {
    if (!input.trim()) return;

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

  return (
    <div className={styles.chats}>
      <aside className={styles.chats__sidebar}>
        <div className={styles.chats__title}>Чаты</div>

        <div className={styles.chats__list}>
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`${styles.chatItem} ${chat.id === activeChatId ? styles.active : ''}`}
              onClick={() => setActiveChatId(chat.id)}
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
        <div className={styles.chat__header}>{activeChat.name}</div>

        <div className={styles.chat__messages}>
          {activeChat.messages.map((m) => (
            <div key={m.id} className={`${styles.msg} ${m.fromMe ? styles.me : styles.them}`}>
              {m.text}
            </div>
          ))}
        </div>

        <div className={styles.chat__input}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Сообщение..."
          />
          <button onClick={sendMessage}>Отпр</button>
        </div>
      </main>
    </div>
  );
};

export default ChatsPage;
