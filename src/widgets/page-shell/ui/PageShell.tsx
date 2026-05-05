import type { PropsWithChildren } from 'react';
import AppHeader from '@/shared/ui/AppHeader/AppHeader';
import AppFooter from '@/shared/ui/AppFooter/AppFooter';
import type { PageShellMode } from '../types';

type PageShellProps = PropsWithChildren<{
  mode: PageShellMode;
}>;

export function PageShell({ mode, children }: PageShellProps) {
  return (
    <main className={`rm-shell rm-shell--${mode}`}>
      <div className="rm-shell__surface">
        <div className="rm-shell__glow" />

        <AppHeader />

        <div className="rm-shell__content">{children}</div>

        <AppFooter />
      </div>
    </main>
  );
}