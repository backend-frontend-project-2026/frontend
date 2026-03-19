import React, { useState } from 'react';
import styles from './SettingsPage.module.css';

const habitsOptions = ['Тишина', 'Не курю', 'Аккуратно'];
const interestsOptions = ['Учёба', 'Спорт', 'Кино', 'Музыка'];

const SettingsPage: React.FC = () => {
  const [photos, setPhotos] = useState<(File | null)[]>([null, null, null]);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [budget, setBudget] = useState('');
  const [quietHours, setQuietHours] = useState('');
  const [habits, setHabits] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [bio, setBio] = useState('');

  const toggleOption = (
    option: string,
    setState: React.Dispatch<React.SetStateAction<string[]>>,
    state: string[]
  ) => {
    if (state.includes(option)) {
      setState(state.filter((o) => o !== option));
    } else {
      setState([...state, option]);
    }
  };

  const handleSave = () => {
    console.log({ name, age, budget, quietHours, habits, interests, bio });
  };

  return (
    <div className={styles.container}>
      {/* ЛЕВАЯ ЧАСТЬ */}
      <div className={styles.profileForm}>
        <div className={styles.photos}>
          {photos.map((photo, idx) => (
            <div key={idx} className={styles.photoSlot}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  const newPhotos = [...photos];
                  newPhotos[idx] = file;
                  setPhotos(newPhotos);
                }}
              />
            </div>
          ))}
        </div>

        <input
          className={styles.input}
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className={styles.input}
          type="number"
          placeholder="Возраст"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />

        <input
          className={styles.input}
          type="text"
          placeholder="Бюджет"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <input
          className={`${styles.input} ${styles.quietHours}`}
          type="text"
          placeholder="Тихие часы"
          value={quietHours}
          onChange={(e) => setQuietHours(e.target.value)}
        />
      </div>

      {/* ПРАВАЯ ЧАСТЬ */}
      <div className={styles.preferences}>
        <div className={styles.section}>
          <h4>Привычки</h4>
          <div className={styles.options}>
            {habitsOptions.map((option) => (
              <button
                key={option}
                className={`${styles.option} ${habits.includes(option) ? styles.active : ''}`}
                onClick={() => toggleOption(option, setHabits, habits)}
              >
                <span className={styles.dot}>●</span> {option}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h4>Интересы</h4>
          <div className={styles.options}>
            {interestsOptions.map((option) => (
              <button
                key={option}
                className={`${styles.option} ${interests.includes(option) ? styles.active : ''}`}
                onClick={() => toggleOption(option, setInterests, interests)}
              >
                <span className={styles.dot}>●</span> {option}
              </button>
            ))}
          </div>
        </div>

        {/* БИО */}
        <div className={styles.bioBlock}>
          <label className={styles.bioLabel}>Короткое био</label>
          <textarea className={styles.bio} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>

        {/* КНОПКИ */}
        <div className={styles.buttons}>
          <button className={styles.cancel}>
            Отмена
            <span className={styles.iconCircle}>
              <span className={styles.arrow}>↗</span>
            </span>
          </button>

          <button className={styles.save} onClick={handleSave}>
            Сохранить
            <span className={styles.iconCircle}>
              <span className={styles.arrow}>↗</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
