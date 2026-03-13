"use client";

import { useState, useRef, useEffect } from 'react';
import { useCampus } from '@/components/CampusContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function AssistantPage() {
  const { activeCampus } = useCampus();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: `Hi Arjun! I'm the BatchMind Study Assistant for ${activeCampus}. I have access to your uploaded notes in the Vault. What would you like to review today?` }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputVal };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      });
      const data = await res.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: data.reply }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: "Sorry, I'm having trouble connecting to the server." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ marginBottom: '1.5rem', flexShrink: 0 }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>AI Study Assistant</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Chat with an AI that knows your <strong>{activeCampus}</strong> course material inside and out.</p>
      </header>

      <section className="glass-panel animate-fade-up delay-100" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0, borderRadius: '24px' }}>
        
        {/* Chat History Viewport */}
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              <div style={{ 
                background: msg.sender === 'user' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', 
                border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                padding: '1rem 1.5rem', 
                borderRadius: msg.sender === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                fontSize: '1rem',
                lineHeight: 1.6,
                boxShadow: msg.sender === 'user' ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1.5rem', borderRadius: '20px 20px 20px 0' }}>
                <span className="animate-pulse">Analyzing notes...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Footer */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '0.5rem', alignItems: 'center' }}>
            <input 
              type="text" 
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Ask a question or type 'quiz' to test your knowledge..." 
              style={{ flex: 1, background: 'transparent', border: 'none', padding: '1rem', color: 'white', outline: 'none', fontSize: '1rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Send</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>

      </section>
    </div>
  );
}
