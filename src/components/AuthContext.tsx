"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { GlobalUser } from "./UserContext";

interface AuthContextType {
  user: GlobalUser | null;
  login: (userData: GlobalUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GlobalUser | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check local storage for an existing mocked session
    const storedUser = localStorage.getItem("batchmind_auth");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (pathname !== "/login") {
      router.push("/login");
    }
  }, [pathname, router]);

  const login = (userData: GlobalUser) => {
    setUser(userData);
    localStorage.setItem("batchmind_auth", JSON.stringify(userData));
    router.push("/"); // Redirect to dashboard Overview on login
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("batchmind_auth");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {/* If we're not logged in, only render children if we're on the login page */}
      {(!user && pathname !== "/login") ? null : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
