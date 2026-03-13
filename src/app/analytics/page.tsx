"use client";

import EnhancedPredictor from '@/components/EnhancedPredictor';
import CGPANavigator from '@/components/CGPANavigator';

export default function AnalyticsPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Analytics Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your attendance risk levels and forecast your target CGPA.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="animate-fade-up">
          <EnhancedPredictor />
        </div>
        
        <div className="animate-fade-up delay-100">
          <CGPANavigator />
        </div>
      </div>
    </div>
  );
}
