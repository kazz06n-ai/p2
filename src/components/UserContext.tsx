"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface GlobalUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  department: string;
  password?: string; // Optional for demo purposes, but used for real auth checks
}

interface UserContextType {
  users: GlobalUser[];
  addUser: (user: Omit<GlobalUser, 'id'>) => GlobalUser;
  updateUser: (id: string, updates: Partial<GlobalUser>) => void;
  deleteUser: (id: string) => void;
  getUserByEmail: (email: string) => GlobalUser | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const INITIAL_USERS: GlobalUser[] = [
  { id: '1', name: 'Arjun Kumar', email: 'arjun@shoolini.edu', password: 'password123', role: 'USER', department: 'B.Tech CSE' },
  { id: '2', name: 'Simran Kaur', email: 'simran@shoolini.edu', password: 'password123', role: 'USER', department: 'BBA' },
  { id: '3', name: 'Vikram Singh', email: 'vikram@shoolini.edu', password: 'password123', role: 'USER', department: 'B.Pharm' },
  { id: 'admin', name: 'Master Administrator', email: 'admin', password: 'admin', role: 'ADMIN', department: 'Super Admin' },
];

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<GlobalUser[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('batchmind_global_users');
    if (saved) {
      setUsers(JSON.parse(saved));
    } else {
      setUsers(INITIAL_USERS);
      localStorage.setItem('batchmind_global_users', JSON.stringify(INITIAL_USERS));
    }
  }, []);

  const addUser = (userData: Omit<GlobalUser, 'id'>) => {
    const newUser: GlobalUser = {
      ...userData,
      id: Date.now().toString() + Math.random().toString(36).substring(7),
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('batchmind_global_users', JSON.stringify(updatedUsers));
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<GlobalUser>) => {
    setUsers(prev => {
      const updated = prev.map(u => u.id === id ? { ...u, ...updates } : u);
      localStorage.setItem('batchmind_global_users', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteUser = (id: string) => {
    setUsers(prev => {
      const updated = prev.filter(u => u.id !== id);
      localStorage.setItem('batchmind_global_users', JSON.stringify(updated));
      return updated;
    });
  };

  const getUserByEmail = (email: string) => {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  };

  // Skip rendering children until mounted to prevent hydration sync issues
  if (!isMounted) return <>{children}</>;

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser, getUserByEmail }}>
      {children}
    </UserContext.Provider>
  );
}

export function useGlobalUsers() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useGlobalUsers must be used within a UserProvider');
  }
  return context;
}
