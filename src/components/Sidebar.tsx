"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

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
      top: 0
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
                color: isActive ? 'white' : 'var(--text-secondary)',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
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

      <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          A
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Arjun</p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Student</p>
        </div>
      </div>
    </aside>
  );
}
