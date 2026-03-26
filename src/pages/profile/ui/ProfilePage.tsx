import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  return (
    <div className={styles.container}>
      {/* Профиль */}
      <section className={styles.profileCard}>
        <div className={styles.header}>
          <div className={styles.avatar}></div>
          <div className={styles.userInfo}>
            <h2>Алекс, 20</h2>
            <p>КФУ • Приволжский • Д-3</p>
          </div>
          <button className={styles.editButton}>Редактировать</button>
        </div>

        {/* Теги */}
        <div className={styles.tags}>
          <span>Тишина</span>
          <span>Не курю</span>
          <span>Аккуратно</span>
          <span>Гости редко</span>
        </div>

        {/* Короткое био */}
        <p className={styles.bio}>
          Люблю порядок и спокойные вечера. Ищу соседа на весенний семестр.
        </p>
      </section>

      {/* Настройки */}
      <section className={styles.settings}>
        <h3>Настройки</h3>
        <ul>
          <li>Тихие часы &gt;</li>
          <li>Приватность &gt;</li>
          <li>Черный список &gt;</li>
          <li>Помощь &gt;</li>
        </ul>
      </section>
    </div>
  );
};

export default ProfilePage;
