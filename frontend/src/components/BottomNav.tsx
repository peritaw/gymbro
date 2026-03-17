import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, BarChart3, User } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/routines', icon: Dumbbell, label: 'Rutinas' },
    { to: '/stats', icon: BarChart3, label: 'Stats' },
    { to: '/profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '0.75rem 1rem',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 50,
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              textDecoration: 'none',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)',
              transition: 'color 0.2s ease',
              position: 'relative',
            })}
          >
            {({ isActive }) => (
              <>
                <div style={{
                  position: 'relative',
                  padding: '0.25rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? 'var(--accent-glow)' : 'transparent',
                  transition: 'background-color 0.2s ease',
                }}>
                  <Icon size={24} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: isActive ? 600 : 500 }}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
