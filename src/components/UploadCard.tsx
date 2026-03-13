"use client";

import { useState, useRef } from 'react';
import styles from '../app/dashboard.module.css'; // Assuming we re-use the module or create a new one
import { useCampus } from './CampusContext';

export default function UploadCard() {
  const [isHovering, setIsHovering] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { activeCampus } = useCampus();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const processFile = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      // 1. OCR Extraction
      const formData = new FormData();
      formData.append('file', file);
      
      const extractRes = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });
      const extractData = await extractRes.json();
      
      if (!extractData.success) {
        throw new Error(extractData.error || 'Failed to extract text');
      }

      // 2. LLM Summarization
      const summarizeRes = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractData.text, university: activeCampus }),
      });
      const summarizeData = await summarizeRes.json();

      if (!summarizeData.success) {
        throw new Error(summarizeData.error || 'Failed to summarize text');
      }

      alert("Note processed successfully!\n\nSummary:\n" + summarizeData.summary);
    } catch (error: any) {
      console.error(error);
      alert("Error processing file: " + error.message);
    } finally {
      setIsProcessing(false);
      setFile(null);
    }
  };

  return (
    <section 
      className={`glass-panel animate-fade-up ${styles.uploadCard}`}
      style={{
        border: isHovering ? '1px solid var(--accent-primary)' : '',
        transform: isHovering ? 'translateY(-4px)' : '',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*,.pdf" 
        onChange={handleFileSelect}
      />

      <div className={styles.uploadIcon} style={{ background: isProcessing ? 'var(--accent-primary)' : 'rgba(99, 102, 241, 0.1)', color: isProcessing ? 'white' : 'var(--accent-primary)' }}>
        {isProcessing ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }}>
            <line x1="12" y1="2" x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
            <line x1="2" y1="12" x2="6" y2="12"/>
            <line x1="18" y1="12" x2="22" y2="12"/>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
          </svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        )}
      </div>

      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <h2>{file ? file.name : "Quick Upload"}</h2>
      <p>{file ? "Ready to extract text" : "Drag & drop notes or capture whiteboard"}</p>
      
      {file ? (
        <button 
          className="btn btn-primary" 
          style={{ marginTop: '1rem', width: '100%' }}
          onClick={processFile}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Extract & Summarize"}
        </button>
      ) : (
        <button 
          className="btn btn-primary" 
          style={{ marginTop: '1rem', width: '100%' }}
          onClick={handleUploadClick}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Select Document
        </button>
      )}
    </section>
  );
}
