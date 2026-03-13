"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Do not render the sidebar if we are not logged in (e.g. on the login page)
  if (!user) return null;

  const links = [
    { name: 'Dashboard', href: '/', icon: '⌂' },
    { name: 'My Vault', href: '/vault', icon: '📂' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
    { name: 'AI Assistant', href: '/assistant', icon: '✨' },
  ];

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1rem',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 50
    }}>
      <div style={{ padding: '0 1rem', marginBottom: '3rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          BatchMind
        </h2>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Academic OS</p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.name} 
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                textDecoration: 'none',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(14, 165, 233, 0.3)' : '1px solid transparent',
                transition: 'all 0.2s ease',
                fontWeight: isActive ? 600 : 400
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{link.icon}</span>
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--glass-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: user.role === 'ADMIN' ? 'var(--danger)' : 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color: 'var(--text-primary)' }}>{user.name}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: user.role === 'ADMIN' ? 'var(--danger)' : 'var(--text-secondary)' }}>{user.role}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={toggleTheme}
            className="btn btn-glass"
            style={{ flex: 1, padding: '0.6rem', fontSize: '1.2rem', justifyContent: 'center' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button 
            onClick={logout}
            className="btn btn-glass" 
            style={{ flex: 2, justifyContent: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
