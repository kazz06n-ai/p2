"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { useCampus } from "@/components/CampusContext";

export default function LoginPage() {
  const { login } = useAuth();
  const { setActiveCampus } = useCampus();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = (role: "USER" | "ADMIN") => {
    setIsLoading(true);
    setTimeout(() => {
      // Simulate login logic
      const name = role === "ADMIN" ? "Admin User" : "Arjun (Student)";
      const uni = "Shoolini University";
      
      setActiveCampus(uni); // Sync campus context
      login(name, role, uni);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      handleDemoLogin("ADMIN");
    } else if (username && password) {
      handleDemoLogin("USER");
    } else {
      setError("Please enter demo credentials.");
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'url(/mesh-bg.jpg) center/cover, var(--bg-dark)',
      position: 'relative'
    }}>
      {/* Dynamic Background Orbs */}
      <div style={{ position: 'absolute', top: '20%', left: '30%', width: '300px', height: '300px', background: 'var(--accent-primary)', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '30%', width: '300px', height: '300px', background: 'var(--accent-secondary)', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%' }} />

      <div className="glass-panel animate-fade-up" style={{ 
        maxWidth: '460px', 
        width: '90%', 
        padding: '3rem', 
        borderRadius: '24px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '3rem', margin: '0 0 0.5rem 0' }}>BatchMind</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>The ultimate Academic OS.</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--danger)', padding: '0.8rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. arjun@shoolini.edu"
              disabled={isLoading}
              style={{ 
                width: '100%', 
                padding: '1rem', 
                background: 'rgba(0,0,0,0.2)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '12px',
                color: 'white',
                outline: 'none',
                transition: 'border 0.2s',
                ...(isLoading ? { opacity: 0.5 } : {})
              }}
              onFocus={(e) => e.target.style.border = '1px solid var(--accent-primary)'}
              onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              style={{ 
                width: '100%', 
                padding: '1rem', 
                background: 'rgba(0,0,0,0.2)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '12px',
                color: 'white',
                outline: 'none',
                transition: 'border 0.2s',
                ...(isLoading ? { opacity: 0.5 } : {})
              }}
              onFocus={(e) => e.target.style.border = '1px solid var(--accent-primary)'}
              onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isLoading}
            style={{ 
              marginTop: '1rem', 
              width: '100%', 
              padding: '1.2rem', 
              justifyContent: 'center',
              fontSize: '1rem' 
            }}
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>Or use a quick demo account:</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => handleDemoLogin("USER")}
              disabled={isLoading}
              className="btn btn-glass" 
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
            >
              Demo User
            </button>
            <button 
              onClick={() => handleDemoLogin("ADMIN")}
              disabled={isLoading}
              className="btn btn-glass" 
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
