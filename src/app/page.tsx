"use client";

import styles from './dashboard.module.css';
import { useCampus } from '@/components/CampusContext';
import Link from 'next/link';

export default function Home() {
  const { activeCampus, setActiveCampus, availableCampuses } = useCampus();

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <header className={styles.header} style={{ marginBottom: '3rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Overview</h1>
          <p className={styles.subtitle}>Welcome back to {activeCampus}, Arjun 👋</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <select 
            value={activeCampus} 
            onChange={(e) => setActiveCampus(e.target.value)}
            style={{ 
              background: 'rgba(0,0,0,0.3)', 
              color: 'var(--accent-secondary)', 
              border: '1px solid var(--accent-secondary)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontFamily: 'var(--font-heading)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {availableCampuses.map(campus => (
              <option key={campus} value={campus} style={{ background: '#1a1a2e', color: 'white' }}>
                {campus}
              </option>
            ))}
          </select>
          <button className="btn btn-glass">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Quick Stats Cards */}
        <div className="glass-panel animate-fade-up">
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Overall Attendance</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: 'var(--success)' }}>86%</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>+2% from last week</p>
        </div>

        <div className="glass-panel animate-fade-up delay-100">
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Current CGPA</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: 'var(--accent-primary)' }}>8.2</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>On track for target 8.5</p>
        </div>

        <div className="glass-panel animate-fade-up delay-200" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--accent-gradient)', border: 'none' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'white' }}>Need to Study?</h3>
          <p style={{ fontSize: '0.9rem', textAlign: 'center', color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>
            Talk to the AI Assistant to generate quizzes from your recently uploaded notes in the Vault.
          </p>
          <Link href="/assistant" className="btn btn-glass" style={{ background: 'rgba(0,0,0,0.3)', width: '100%', justifyContent: 'center' }}>
            Launch Assistant
          </Link>
        </div>
      </div>
    </div>
  );
}

