"use client";

import { useState, useEffect } from 'react';
import styles from '../app/dashboard.module.css';
import { useCampus } from './CampusContext';

interface Note {
  id: string;
  summaryText: string;
  createdAt: string;
  uploader: { name: string };
  university: string;
}

export default function FeedList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { activeCampus } = useCampus();

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notes?university=${encodeURIComponent(activeCampus)}`);
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
    fetchNotes();
  }, [activeCampus]);

  if (loading) return <p className={styles.predictorHint}>Loading {activeCampus} Vault...</p>;
  
  if (notes.length === 0) return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <p className={styles.predictorHint}>No notes in the Vault for <strong>{activeCampus}</strong> yet.</p>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Be the first to upload one above!</p>
    </div>
  );

  return (
    <div className={styles.feedList}>
      {notes.map(note => (
        <div key={note.id} className={styles.feedItem}>
          <div className={styles.feedIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <div className={styles.feedContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h4>Uploaded by {note.uploader?.name || 'Unknown'}</h4>
              <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{note.university}</span>
            </div>
            <p>{note.summaryText}</p>
            <div className={styles.feedMeta}>
              <span>{new Date(note.createdAt).toLocaleString()}</span>
              <button className={styles.linkBtn}>View Raw</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
