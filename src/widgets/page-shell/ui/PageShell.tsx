import { NavLink } from 'react-router-dom';
import type { PropsWithChildren } from 'react';
import { RoutePaths } from '@/app/router/routePaths';
import AppFooter from '@/shared/ui/AppFooter/AppFooter';
import type { PageShellMode } from '../types';
import { Avatar } from 'antd';

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
          <Avatar className="rm-shell__avatar" />
        </header>

        <div className="rm-shell__content">{children}</div>

        <AppFooter />
      </div>
    </main>
  );
}
