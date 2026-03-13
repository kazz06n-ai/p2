"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type CampusContextType = {
  activeCampus: string; // Keeping variable name for backward-compatibility with other files, but it refers to Departments now
  setActiveCampus: (campus: string) => void;
  availableCampuses: string[]; 
};

const CampusContext = createContext<CampusContextType | undefined>(undefined);

export function CampusProvider({ children }: { children: ReactNode }) {
  // Default to B.Tech CSE for Shoolini University
  const [activeCampus, setActiveCampus] = useState("B.Tech CSE");
  
  // Shoolini University Exclusive Departments
  const availableCampuses = [
    "B.Tech CSE",
    "B.Sc Biotechnology",
    "BBA",
    "MBA",
    "B.A. Journalism & Mass Comm."
  ];

  return (
    <CampusContext.Provider value={{ activeCampus, setActiveCampus, availableCampuses }}>
      {children}
    </CampusContext.Provider>
  );
}

export function useCampus() {
  const context = useContext(CampusContext);
  if (context === undefined) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
}
