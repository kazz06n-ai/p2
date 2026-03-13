"use client";

import { useState, useRef, useEffect } from 'react';
import styles from '../app/dashboard.module.css';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function StudyBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: "Hi! I'm BatchMind StudyBot. Ask me questions about your uploaded notes!" }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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
    <>
      {/* Floating Action Button purely for UI, clicking it opens the bot */}
      {!isOpen && (
        <button 
          className="btn btn-primary" 
          onClick={() => setIsOpen(true)}
          style={{ position: 'fixed', bottom: '2rem', right: '2rem', padding: '1rem', borderRadius: '50%', boxShadow: '0 8px 32px var(--accent-primary)', zIndex: 50 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <path d="M3 10c0-3.87 3.13-7 7-7h4c3.87 0 7 3.13 7 7v4c0 1.66-1.34 3-3 3H6c-1.66 0-3-1.34-3-3v-4z"/>
            <circle cx="9" cy="11" r="1.5"/>
            <circle cx="15" cy="11" r="1.5"/>
          </svg>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div 
          className="glass-panel" 
          style={{ 
            position: 'fixed', bottom: '2rem', right: '2rem', width: '350px', height: '500px', 
            display: 'flex', flexDirection: 'column', zIndex: 100, padding: 0, overflow: 'hidden',
            boxShadow: '0 12px 48px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {/* Main Chat Header */}
          <div style={{ background: 'var(--accent-gradient)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>StudyBot</h3>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Chat History */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{ 
                  background: msg.sender === 'user' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', 
                  padding: '0.75rem 1rem', 
                  borderRadius: msg.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  fontSize: '0.9rem',
                  lineHeight: 1.4
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.75rem 1rem', borderRadius: '16px 16px 16px 0', fontSize: '0.9rem' }}>
                  <span className="animate-pulse">Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Ask about your notes..." 
              style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.5rem 1rem', color: 'white', outline: 'none' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem', borderRadius: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
