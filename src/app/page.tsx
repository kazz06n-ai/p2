"use client";

import styles from './dashboard.module.css';
import { useCampus } from '@/components/CampusContext';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { activeCampus, setActiveCampus, availableCampuses } = useCampus();
  const { user } = useAuth();

  if (!user) return null; // Let the AuthProvider handle the redirect

  if (user.role === 'ADMIN') {
    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <header className={styles.header} style={{ marginBottom: '3rem' }}>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Admin Control Panel</h1>
            <p className={styles.subtitle}>System Management for {activeCampus}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
              SUPERUSER ACTIVE
            </span>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-panel animate-fade-up" style={{ borderTop: '4px solid var(--danger)' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Total Active Users</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>1,284</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--success)', marginTop: '0.5rem' }}>+12% this month</p>
          </div>

          <div className="glass-panel animate-fade-up delay-100" style={{ borderTop: '4px solid var(--accent-primary)' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>System Health</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: 'var(--success)' }}>99.9%</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>All services operational</p>
          </div>

          <div className="glass-panel animate-fade-up delay-200" style={{ borderTop: '4px solid var(--warning)' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Pending Reports</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: 'var(--warning)' }}>4</p>
            <button className="btn btn-glass" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
              Review Flags
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <header className={styles.header} style={{ marginBottom: '3rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Overview</h1>
          <p className={styles.subtitle}>Welcome back to {activeCampus}, {user.name.split(' ')[0]} 👋</p>
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
        <div className="glass-panel animate-fade-up" style={{ transition: 'transform 0.2s', cursor: 'default' }}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} 
             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Overall Attendance</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: 'var(--success)' }}>86%</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>+2% from last week</p>
        </div>

        <div className="glass-panel animate-fade-up delay-100" style={{ transition: 'transform 0.2s', cursor: 'default' }}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} 
             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Current CGPA</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: 'var(--accent-primary)' }}>8.2</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>On track for target 8.5</p>
        </div>

        <div className="glass-panel animate-fade-up delay-200" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--accent-gradient)', border: 'none', transition: 'transform 0.2s, box-shadow 0.2s' }}
             onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px -10px var(--accent-primary)'; }} 
             onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'white' }}>Need to Study?</h3>
          <p style={{ fontSize: '0.9rem', textAlign: 'center', color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>
            Talk to the AI Assistant to generate quizzes from your recently uploaded notes in the Vault.
          </p>
          <Link href="/assistant" className="btn btn-glass" style={{ background: 'rgba(0,0,0,0.3)', width: '100%', justifyContent: 'center' }}>
            Launch Assistant
          </Link>
        </div>
      </div>

      {/* --- QUICK LOG ATTENDANCE WIDGET --- */}
      <h2 style={{ fontSize: '1.5rem', marginTop: '3rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Today&apos;s Classes (Quick-Log)</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        <QuickLogWidget />
      </div>
    </div>
  );
}

// Sub-component to handle client-side local storage safely
import { useState, useEffect } from 'react';

interface QuickLogSubject {
  id: string;
  name: string;
  current: number;
  required: number;
  weight: number;
  weeklySchedule?: string[];
}

function QuickLogWidget() {
  const [localSubjects, setLocalSubjects] = useState<QuickLogSubject[]>([]);
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
    const saved = localStorage.getItem('batchmind_subjects');
    if (saved) {
      setLocalSubjects(JSON.parse(saved));
    }
  }, []);

  const handleLog = (id: string, type: 'attended' | 'skipped') => {
    const updated = localSubjects.map(subj => {
      if (subj.id === id) {
        const newCurrent = type === 'attended' 
          ? Math.min(100, subj.current + 2) 
          : Math.max(0, subj.current - 2);
          
        return { ...subj, current: newCurrent };
      }
      return subj;
    });

    setLocalSubjects(updated);
    localStorage.setItem('batchmind_subjects', JSON.stringify(updated));
  };

  if (!client) return null;

  if (localSubjects.length === 0) {
    return (
      <div className="glass-panel animate-fade-up" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No custom subjects added yet.</p>
        <Link href="/analytics" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Add Subjects in Analytics ➔
        </Link>
      </div>
    );
  }

  // Filter strictly for today's classes based on the new Timetable system
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const todaySubjects = localSubjects.filter(subj => subj.weeklySchedule?.includes(currentDay));

  if (todaySubjects.length === 0) {
    return (
      <div className="glass-panel animate-fade-up" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', border: '1px solid var(--success)', background: 'rgba(16, 185, 129, 0.05)' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--success)', marginBottom: '0.5rem' }}>No Classes Today!</h3>
        <p style={{ color: 'var(--text-secondary)' }}>You have a clear schedule for {currentDay}. Enjoy your free time or hit the Vault to study ahead. 🎉</p>
      </div>
    );
  }

  return (
    <>
      {todaySubjects.map(subj => (
        <div key={subj.id} className="glass-panel animate-fade-up" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s', cursor: 'default' }} 
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} 
             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{subj.name}</h4>
            <span style={{ fontSize: '1.2rem', fontWeight: 600, color: subj.current >= subj.required ? 'var(--success)' : 'var(--warning)' }}>
              {subj.current}%
            </span>
          </div>

          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Required: {subj.required}%</p>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
            <button 
              onClick={() => handleLog(subj.id, 'attended')}
              className="btn btn-glass" 
              style={{ flex: 1, justifyContent: 'center', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
            >
              ✔ Attended
            </button>
            <button 
              onClick={() => handleLog(subj.id, 'skipped')}
              className="btn btn-glass" 
              style={{ flex: 1, justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              ✖ Missed
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

