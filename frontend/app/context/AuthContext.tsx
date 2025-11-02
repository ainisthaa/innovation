"use client";

import pb from "@/lib/pocketbase";
import React, { createContext, useContext, useEffect, useState } from "react";


interface User {
  id: string;
  name: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (id: string, name: string) => void;
  logout: () => void;
  openLogin: () => void;
  isLoginOpen: boolean;
  setLoginOpen: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setLoginOpen] = useState(false);

  // ✅ โหลด user ที่เคย login ไว้จาก localStorage + token ของ PocketBase
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // ถ้ามี token เก็บไว้ใน pb.authStore แล้ว valid → โหลด user อัตโนมัติ
    if (pb.authStore.isValid && pb.authStore.model) {
      const u = pb.authStore.model;
      setUser({ id: u.id, name: u.name, email: u.email });
    }
  }, []);

  // ✅ login จริงจาก API (เรียกจาก LoginDialog)
  const login = (id: string, name: string) => {
    const newUser = { id, name };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    setLoginOpen(false);
  };

  // ✅ logout จริง — ล้างทั้ง localStorage และ PocketBase token
  const logout = () => {
    pb.authStore.clear();
    setUser(null);
    localStorage.removeItem("user");

    // แจ้งทุกหน้าให้รู้ว่ามีการ logout
    window.dispatchEvent(new Event("storage"));
  };

  const openLogin = () => setLoginOpen(true);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, openLogin, isLoginOpen, setLoginOpen }}
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
