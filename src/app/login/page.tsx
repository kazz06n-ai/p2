"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { useCampus } from "@/components/CampusContext";
import { useGlobalUsers } from "@/components/UserContext";

export default function LoginPage() {
  const { login } = useAuth();
  const { setActiveCampus, activeCampus } = useCampus();
  const { addUser, getUserByEmail } = useGlobalUsers();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (!fullName || !username || !password) {
        setError("Please fill out all fields.");
        return;
      }
      
      const existingUser = getUserByEmail(username);
      if (existingUser) {
        setError("An account with this email already exists.");
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        const newUser = addUser({
          name: fullName,
          email: username,
          password: password,
          role: "USER",
          department: activeCampus // Assuming the user selects their Dept before or default is fine
        });
        login(newUser);
      }, 800);
      
    } else {
      if (!username || !password) {
        setError("Please enter credentials.");
        return;
      }
      
      setIsLoading(true);
      setTimeout(() => {
        const user = getUserByEmail(username);
        // Direct password check against mock DB (Insecure, but fine for simulated offline demo)
        if (user && user.password === password) {
          login(user);
        } else {
          setError("Invalid username or password.");
          setIsLoading(false);
        }
      }, 800);
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
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
            {isSignUp ? "Create your account." : "The ultimate Academic OS."}
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--danger)', padding: '0.8rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {isSignUp && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Arjun Kumar"
                disabled={isLoading}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  background: 'rgba(0,0,0,0.1)', 
                  border: '1px solid var(--glass-border)', 
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  transition: 'border 0.2s',
                  ...(isLoading ? { opacity: 0.5 } : {})
                }}
                onFocus={(e) => e.target.style.border = '1px solid var(--accent-primary)'}
                onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
              />
            </div>
          )}

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
                background: 'rgba(0,0,0,0.1)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '12px',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border 0.2s',
                ...(isLoading ? { opacity: 0.5 } : {})
              }}
              onFocus={(e) => e.target.style.border = '1px solid var(--accent-primary)'}
              onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
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
                background: 'rgba(0,0,0,0.1)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '12px',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border 0.2s',
                ...(isLoading ? { opacity: 0.5 } : {})
              }}
              onFocus={(e) => e.target.style.border = '1px solid var(--accent-primary)'}
              onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
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
            {isLoading ? "Authenticating..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button 
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--accent-primary)', 
              fontSize: '0.9rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
