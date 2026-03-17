import type { ReactNode } from 'react';
import BottomNav from './BottomNav';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-layout">
      <main className="app-content">
        <div className="container">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
