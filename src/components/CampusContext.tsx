"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type CampusContextType = {
  activeCampus: string;
  setActiveCampus: (campus: string) => void;
  availableCampuses: string[];
};

const CampusContext = createContext<CampusContextType | undefined>(undefined);

export function CampusProvider({ children }: { children: ReactNode }) {
  // Default to Shoolini base on MVP
  const [activeCampus, setActiveCampus] = useState("Shoolini University");
  
  // Hardcoded for demo multi-tenancy
  const availableCampuses = [
    "Shoolini University",
    "MIT",
    "Stanford",
    "IIT Delhi"
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
