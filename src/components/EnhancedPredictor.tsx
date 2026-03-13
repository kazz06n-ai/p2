"use client";

import { useState, useEffect } from 'react';
import styles from '../app/dashboard.module.css';

interface SubjectData {
  id: string;
  name: string;
  current: number;
  required: number;
  weight: number;
  weeklySchedule: string[];
}

export default function EnhancedPredictor() {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [predictions, setPredictions] = useState<Record<string, { safePercentage: number, recommendation: string }>>({});
  const [isClient, setIsClient] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('batchmind_subjects');
    if (saved) {
      setSubjects(JSON.parse(saved));
    } else {
      // Default initial subjects
      setSubjects([
        { id: '1', name: 'Physics 101', current: 82, required: 75, weight: 0.6, weeklySchedule: ['Mon', 'Wed', 'Fri'] },
        { id: '2', name: 'Data Structures', current: 71, required: 75, weight: 0.8, weeklySchedule: ['Tue', 'Thu'] },
      ]);
    }
  }, []);

  // Save to local storage whenever subjects change
  useEffect(() => {
    if (isClient && subjects.length > 0) {
      localStorage.setItem('batchmind_subjects', JSON.stringify(subjects));
    }
  }, [subjects, isClient]);

  // Recalculate prediction when subjects change
  useEffect(() => {
    if (!isClient) return;

    const calculateAll = async () => {
      const results: Record<string, any> = {};
      
      for (const subj of subjects) {
        try {
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
  }, [subjects, isClient]);

  const updateSubject = (id: string, field: keyof SubjectData, value: number | string) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addSubject = () => {
    const newId = Date.now().toString();
    setSubjects(prev => [...prev, {
      id: newId,
      name: 'New Subject',
      current: 75,
      required: 75,
      weight: 0.5,
      weeklySchedule: []
    }]);
  };

  const toggleDay = (id: string, day: string) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === id) {
        const schedule = s.weeklySchedule || [];
        const newSchedule = schedule.includes(day)
          ? schedule.filter(d => d !== day)
          : [...schedule, day];
        return { ...s, weeklySchedule: newSchedule };
      }
      return s;
    }));
  };

  const removeSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    
    // If we've removed the last subject, clear local storage
    if (subjects.length === 1) {
      localStorage.removeItem('batchmind_subjects');
    }
  };

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <section className={`glass-panel animate-fade-up delay-100 ${styles.predictorCard}`} style={{ gridColumn: '1 / -1' }}>
      <div className={styles.cardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>Attendance Analyzer & Safe-to-Skip Predictor</h3>
        <button onClick={addSubject} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
          + Add Subject
        </button>
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
              border: `1px solid ${isSafe ? 'rgba(16, 185, 129, 0.3)' : isWarning ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              position: 'relative'
            }}>
              <button 
                onClick={() => removeSubject(subj.id)}
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
                title="Remove Subject"
              >
                ×
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingRight: '1rem' }}>
                <input 
                  type="text" 
                  value={subj.name} 
                  onChange={e => updateSubject(subj.id, 'name', e.target.value)}
                  style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600, outline: 'none', width: '65%' }}
                />
                {pred && (
                  <span className={`badge ${isSafe ? 'badge-success' : isWarning ? 'badge-warning' : 'badge-danger'}`}>
                    {pred.safePercentage.toFixed(0)}% Safe
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>Current %</span>
                  <input type="number" value={subj.current} onChange={e => updateSubject(subj.id, 'current', Number(e.target.value))} style={{ width: '50px', background: 'transparent', color: 'var(--text-primary)', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', fontFamily: 'var(--font-heading)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>Req. %</span>
                  <input type="number" value={subj.required} onChange={e => updateSubject(subj.id, 'required', Number(e.target.value))} style={{ width: '50px', background: 'transparent', color: 'var(--text-primary)', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', fontFamily: 'var(--font-heading)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>Exam Wt</span>
                  <input type="number" step="0.1" value={subj.weight} onChange={e => updateSubject(subj.id, 'weight', Number(e.target.value))} style={{ width: '50px', background: 'transparent', color: 'var(--text-primary)', border: 'none', borderBottom: '1px solid var(--glass-border)', fontFamily: 'var(--font-heading)' }} />
                </div>
              </div>

              {/* Weekly Schedule Toggle */}
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                  const schedule = subj.weeklySchedule || [];
                  const isSelected = schedule.includes(day);
                  return (
                    <button
                      key={day}
                      onClick={() => toggleDay(subj.id, day)}
                      style={{
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                        background: isSelected ? 'var(--accent-primary)' : 'rgba(0,0,0,0.05)',
                        color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {pred && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                  <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '1rem' }}>
                    <SvgRing percentage={pred.safePercentage} isSafe={isSafe} isWarning={isWarning} />
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{pred.safePercentage.toFixed(0)}%</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>SAFE</span>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.5 }}>
                    {pred.recommendation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Helper component for drawing the animated SVG ring
function SvgRing({ percentage, isSafe, isWarning }: { percentage: number, isSafe: boolean, isWarning: boolean }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  // Ensure percentage is between 0 and 100
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (clampedPct / 100) * circumference;
  
  const color = isSafe ? 'var(--success)' : isWarning ? 'var(--warning)' : 'var(--danger)';

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 8px ${color})` }}>
      {/* Background Track */}
      <circle 
        cx="60" cy="60" r={radius} 
        fill="transparent" 
        stroke="rgba(255,255,255,0.05)" 
        strokeWidth="10" 
      />
      {/* Active Animated Ring */}
      <circle 
        cx="60" cy="60" r={radius} 
        fill="transparent" 
        stroke={color} 
        strokeWidth="10" 
        strokeDasharray={circumference} 
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.3s ease' }}
      />
    </svg>
  );
}
