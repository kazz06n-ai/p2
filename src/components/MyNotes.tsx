"use client";

import { useState, useEffect } from 'react';
import styles from '../app/dashboard.module.css';

interface Note {
  id: string;
  summaryText: string;
  createdAt: string;
  fileType: string;
}

export default function MyNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyNotes = async () => {
    try {
      const res = await fetch('/api/notes/me');
      const data = await res.json();
      if (data.success) {
        setNotes(data.notes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyNotes();
  }, []);

  if (loading) return <p className={styles.predictorHint}>Loading your personal notes...</p>;
  if (notes.length === 0) return <p className={styles.predictorHint}>You haven't uploaded any notes yet.</p>;

  return (
    <div className={styles.feedList}>
      {notes.map(note => (
        <div key={note.id} className={styles.feedItem}>
          <div className={styles.feedIcon} style={{ background: 'var(--accent-secondary)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div className={styles.feedContent}>
            <h4>{note.fileType} Document</h4>
            <p>{note.summaryText}</p>
            <div className={styles.feedMeta}>
              <span>{new Date(note.createdAt).toLocaleString()}</span>
              <button className={styles.linkBtn}>Edit Details</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
