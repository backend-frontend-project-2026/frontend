import { NavLink } from 'react-router-dom';
import type { PropsWithChildren } from 'react';
import { RoutePaths } from '@/app/router/routePaths';

type PageShellMode =
  | 'step-1'
  | 'step-2'
  | 'step-3'
  | 'step-4'
  | 'discover'
  | 'filters'
  | 'candidate';

type PageShellProps = PropsWithChildren<{
  mode: PageShellMode;
}>;

export function PageShell({ mode, children }: PageShellProps) {
  return (
    <main className={`rm-shell rm-shell--${mode}`}>
      <div className="rm-shell__surface">
        <div className="rm-shell__glow" />

        <header className="rm-shell__topbar">
          <div className="rm-shell__brand">RoomieMatch</div>

          <nav className="rm-shell__nav" aria-label="Основная навигация">
            <NavLink
              to={RoutePaths.DISCOVER}
              className={({ isActive }) =>
                isActive ? 'rm-shell__nav-pill is-active' : 'rm-shell__nav-pill'
              }
            >
              Поиск
            </NavLink>

            <NavLink
              to={RoutePaths.MATCHES}
              className={({ isActive }) =>
                isActive ? 'rm-shell__nav-pill is-active' : 'rm-shell__nav-pill'
              }
            >
              Мэтчи
            </NavLink>

            <NavLink
              to={RoutePaths.CHATS}
              className={({ isActive }) =>
                isActive ? 'rm-shell__nav-pill is-active' : 'rm-shell__nav-pill'
              }
            >
              Чаты
            </NavLink>

            <NavLink
              to={RoutePaths.PROFILE}
              className={({ isActive }) =>
                isActive ? 'rm-shell__nav-pill is-active' : 'rm-shell__nav-pill'
              }
            >
              Профиль
            </NavLink>
          </nav>

          <div className="rm-shell__search">Поиск по мэтчам/чатам...</div>
          <div className="rm-shell__avatar" />
        </header>

        <div className="rm-shell__content">{children}</div>

        <footer className="rm-shell__footer rm-shell__footer--step-1">
          <div className="rm-shell__footer-brand">
            <strong>RoomieMatch</strong>
            <span>Поиск соседа по привычкам</span>
          </div>

          <div className="rm-shell__footer-links">
            <span>О проекте</span>
            <span>Правила</span>
            <span>Конфиденциальность</span>
            <span>Поддержка</span>
          </div>

          <div className="rm-shell__footer-badge">© 2026</div>

          <div className="rm-shell__footer-copy">
            <span>© 2026 RoomieMatch</span>
            <span>Сделано для студентов</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
