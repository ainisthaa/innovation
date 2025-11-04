"use client"; // ✅ client component ที่ใช้ React state

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

  // ✅ โหลดสถานะล็อกอินจาก PocketBase authStore
  useEffect(() => {
    if (pb.authStore.isValid && pb.authStore.model) {
      const u = pb.authStore.model;
      setUser({ id: u.id, name: u.name, email: u.email });
    }
  }, []);

  // ✅ ล็อกอินผ่าน PocketBase SDK
  const loginWithPocketBase = async (email: string, password: string) => {
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);

      const record = authData.record;
      setUser({ id: record.id, name: record.name, email: record.email });
      setLoginOpen(false);

      console.log("✅ Login success");
      console.log("pb.authStore.isValid:", pb.authStore.isValid);
      console.log("pb.authStore.token:", pb.authStore.token);
      console.log("pb.authStore.model.id:", pb.authStore.model.id);
    } catch (err: any) {
      console.error("❌ Login failed:", err);
      throw err;
    }
  };

  // ✅ ออกจากระบบ
  const logout = () => {
    pb.authStore.clear();
    setUser(null);
    console.log("🚪 Logged out.");
  };

  const openLogin = () => setLoginOpen(true);

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
