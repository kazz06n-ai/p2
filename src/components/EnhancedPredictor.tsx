"use client";

import { useState, useEffect } from 'react';
import styles from '../app/dashboard.module.css';

interface SubjectData {
  id: string;
  name: string;
  current: number;
  required: number;
  weight: number;
}

export default function EnhancedPredictor() {
  const [subjects, setSubjects] = useState<SubjectData[]>([
    { id: '1', name: 'Physics 101', current: 82, required: 75, weight: 0.6 },
    { id: '2', name: 'Data Structures', current: 71, required: 75, weight: 0.8 },
    { id: '3', name: 'Calculus II', current: 90, required: 75, weight: 0.5 },
  ]);

  const [predictions, setPredictions] = useState<Record<string, { safePercentage: number, recommendation: string }>>({});

  // Recalculate prediction when subjects change
  useEffect(() => {
    const calculateAll = async () => {
      const results: Record<string, any> = {};
      
      for (const subj of subjects) {
        try {
          // Send request to our existing predict API
          const res = await fetch('/api/attendance/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              currentAttendance: subj.current, 
              requiredThreshold: subj.required, 
              examWeight: subj.weight,
              subjectName: subj.name
            })
          });
          const data = await res.json();
          if (data.success) {
            results[subj.id] = data;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setPredictions(results);
    };

    calculateAll();
  }, [subjects]);

  const updateSubject = (id: string, field: keyof SubjectData, value: number) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <section className={`glass-panel animate-fade-up delay-100 ${styles.predictorCard}`} style={{ gridColumn: '1 / -1' }}>
      <div className={styles.cardHeader}>
        <h3>Attendance Analyzer & Safe-to-Skip Predictor</h3>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {subjects.map(subj => {
          const pred = predictions[subj.id];
          const isSafe = pred && pred.safePercentage > 75;
          const isWarning = pred && pred.safePercentage > 50 && pred.safePercentage <= 75;

          return (
            <div key={subj.id} style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: `1px solid ${isSafe ? 'rgba(16, 185, 129, 0.3)' : isWarning ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{subj.name}</h4>
                {pred && (
                  <span className={`badge ${isSafe ? 'badge-success' : isWarning ? 'badge-warning' : 'badge-danger'}`}>
                    {pred.safePercentage.toFixed(0)}% Safe
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>Current %</span>
                  <input type="number" value={subj.current} onChange={e => updateSubject(subj.id, 'current', Number(e.target.value))} style={{ width: '50px', background: 'transparent', color: 'white', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', fontFamily: 'var(--font-heading)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>Req. %</span>
                  <input type="number" value={subj.required} onChange={e => updateSubject(subj.id, 'required', Number(e.target.value))} style={{ width: '50px', background: 'transparent', color: 'white', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', fontFamily: 'var(--font-heading)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>Exam Wt</span>
                  <input type="number" step="0.1" value={subj.weight} onChange={e => updateSubject(subj.id, 'weight', Number(e.target.value))} style={{ width: '50px', background: 'transparent', color: 'white', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', fontFamily: 'var(--font-heading)' }} />
                </div>
              </div>

              {pred && (
                <>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ 
                      width: `${pred.safePercentage}%`, 
                      background: isSafe ? 'var(--success)' : isWarning ? 'var(--warning)' : 'var(--danger)' 
                    }}></div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    {pred.recommendation}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
