// app/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import pb from "@/lib/pocketbase";

interface User {
  id: string;
  name: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  loginWithPocketBase: (email: string, password: string) => Promise<void>;
  logout: () => void;
  openLogin: () => void;
  isLoginOpen: boolean;
  setLoginOpen: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ โหลดสถานะล็อกอินจาก PocketBase authStore
  useEffect(() => {
    // Check if already logged in
    if (pb.authStore.isValid && pb.authStore.model) {
      const u = pb.authStore.model;
      setUser({ 
        id: u.id, 
        name: u.name || u.email || "User", 
        email: u.email 
      });
    }
    
    setLoading(false);

    // Subscribe to auth changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      if (model) {
        setUser({
          id: model.id,
          name: model.name || model.email || "User",
          email: model.email,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // ✅ ล็อกอินผ่าน PocketBase SDK
  const loginWithPocketBase = async (email: string, password: string) => {
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);

      const record = authData.record;
      setUser({ 
        id: record.id, 
        name: record.name || record.email || "User", 
        email: record.email 
      });
      setLoginOpen(false);

      console.log("✅ Login success");
    } catch (err: any) {
      console.error("❌ Login failed:", err);
      throw new Error(err?.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  // ✅ ออกจากระบบ
  const logout = () => {
    pb.authStore.clear();
    setUser(null);
    console.log("🚪 Logged out.");
  };

  const openLogin = () => setLoginOpen(true);

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithPocketBase,
        logout,
        openLogin,
        isLoginOpen,
        setLoginOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}