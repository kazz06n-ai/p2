"use client";

import { useState, useEffect } from 'react';
import styles from '../app/dashboard.module.css';

export default function PredictorWidget() {
  const [currentAttendance, setCurrentAttendance] = useState(72);
  const [requiredThreshold, setRequiredThreshold] = useState(75);
  const [examWeight, setExamWeight] = useState(0.5);
  const [prediction, setPrediction] = useState<{ score: number, safePercentage: number, recommendation: string } | null>(null);

  useEffect(() => {
    const calculate = async () => {
      try {
        const res = await fetch('/api/attendance/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentAttendance, requiredThreshold, examWeight })
        });
        const data = await res.json();
        if (data.success) {
          setPrediction(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    calculate();
  }, [currentAttendance, requiredThreshold, examWeight]);

  return (
    <section className={`glass-panel animate-fade-up delay-100 ${styles.predictorCard}`}>
      <div className={styles.cardHeader}>
        <h3>Safe-to-Skip </h3>
        {prediction && (
          <span className={`badge ${prediction.safePercentage > 75 ? 'badge-success' : 'badge-warning'}`}>
            {prediction.safePercentage.toFixed(0)}% Safe
          </span>
        )}
      </div>
      
      <div className={styles.attendanceStats}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Current (%)</span>
          <input 
            type="number" 
            value={currentAttendance} 
            onChange={e => setCurrentAttendance(Number(e.target.value))}
            style={{ width: '60px', background: 'transparent', color: 'white', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}
          />
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Required (%)</span>
          <input 
            type="number" 
            value={requiredThreshold} 
            onChange={e => setRequiredThreshold(Number(e.target.value))}
            style={{ width: '60px', background: 'transparent', color: 'white', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}
          />
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Exam Wt</span>
          <input 
            type="number" 
            step="0.1"
            value={examWeight} 
            onChange={e => setExamWeight(Number(e.target.value))}
            style={{ width: '60px', background: 'transparent', color: 'white', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}
          />
        </div>
      </div>
      
      {prediction && (
        <>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${prediction.safePercentage}%`, background: prediction.safePercentage > 75 ? 'var(--success)' : 'var(--warning)' }}></div>
          </div>
          <p className={styles.predictorHint}>{prediction.recommendation}</p>
        </>
      )}
    </section>
  );
}
