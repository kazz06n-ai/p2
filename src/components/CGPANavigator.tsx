"use client";

import { useState } from 'react';
import styles from '../app/dashboard.module.css';

interface CGPAResult {
  requiredGPA: number;
  isPossible: boolean;
  message: string;
}

export default function CGPANavigator() {
  const [currentCGPA, setCurrentCGPA] = useState<number>(7.5);
  const [totalCredits, setTotalCredits] = useState<number>(60);
  const [targetCGPA, setTargetCGPA] = useState<number>(8.0);
  const [upcomingCredits, setUpcomingCredits] = useState<number>(20);

  const [result, setResult] = useState<CGPAResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    
    try {
      const res = await fetch('/api/cgpa/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentCGPA, totalCreditsCompleted: totalCredits, targetCGPA, upcomingCredits })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <section className={`glass-panel animate-fade-up delay-300 ${styles.predictorCard}`} style={{ gridColumn: '1 / -1' }}>
      <div className={styles.cardHeader}>
        <h3>CGPA Navigator Target Tracker</h3>
        <span className="badge badge-success">Planner</span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Current CGPA (Out of 10)</label>
          <input 
            type="number" step="0.01" max="10" min="0" required
            value={currentCGPA} onChange={e => setCurrentCGPA(Number(e.target.value))}
            style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Credits Completed</label>
          <input 
            type="number" min="1" required
            value={totalCredits} onChange={e => setTotalCredits(Number(e.target.value))}
            style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Target CGPA</label>
          <input 
            type="number" step="0.01" max="10" min="0" required
            value={targetCGPA} onChange={e => setTargetCGPA(Number(e.target.value))}
            style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--accent-primary)', borderRadius: '8px', color: 'white' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Upcoming Credits</label>
          <input 
            type="number" min="1" required
            value={upcomingCredits} onChange={e => setUpcomingCredits(Number(e.target.value))}
            style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
          />
        </div>
      </div>

      <button className="btn btn-primary" onClick={calculateTarget} disabled={isCalculating} style={{ width: '100%' }}>
        {isCalculating ? 'Calculating...' : 'Calculate Required GPA'}
      </button>

      {result && (
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          borderRadius: '12px', 
          background: result.isPossible ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          borderLeft: `4px solid ${result.isPossible ? 'var(--success)' : 'var(--danger)'}`
        }}>
          <h4 style={{ marginBottom: '0.5rem', color: result.isPossible ? 'var(--success)' : 'var(--danger)' }}>
            {result.isPossible ? `Requirement: ${result.requiredGPA.toFixed(2)} GPA` : 'Target Mathematically Impossible'}
          </h4>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>{result.message}</p>
        </div>
      )}
    </section>
  );
}
