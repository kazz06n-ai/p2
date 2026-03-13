"use client";

import UploadCard from '@/components/UploadCard';
import FeedList from '@/components/FeedList';
import MyNotes from '@/components/MyNotes';
import { useCampus } from '@/components/CampusContext';

export default function VaultPage() {
  const { activeCampus } = useCampus();

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>The Vault</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your personal notes and explore resources deposited by others at <strong>{activeCampus}</strong>.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Left Column for Uploading and Personal Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <UploadCard />
          <section className="glass-panel animate-fade-up delay-100" style={{ padding: '1.5rem', borderRadius: '24px' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>My Notes</h3>
            <MyNotes />
          </section>
        </div>

        {/* Right Column for Global Campus Feed */}
        <section className="glass-panel animate-fade-up delay-200" style={{ padding: '1.5rem', borderRadius: '24px', minHeight: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            <h3 style={{ margin: 0 }}>Campus Note Stream</h3>
            <span className="badge badge-primary">{activeCampus}</span>
          </div>
          <FeedList />
        </section>
      </div>
    </div>
  );
}
