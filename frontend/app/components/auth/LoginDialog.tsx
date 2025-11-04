"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/app/context/AuthContext";

export function LoginDialog() {
  const { loginWithPocketBase, isLoginOpen, setLoginOpen } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginWithPocketBase(email, password);
      setLoginOpen(false);
    } catch (err) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={setLoginOpen}>
      <DialogContent
        className="w-[480px] h-[420px] rounded-[10px] flex flex-col items-center justify-center px-8"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold mb-6">
            เข้าสู่ระบบด้วยบัญชีผู้ใช้
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleLogin} className="w-full flex flex-col space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold text-sm">
              อีเมล
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@kmitl.ac.th"
              className="border border-gray-400 rounded-md h-[40px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-semibold text-sm">
              รหัสผ่าน
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border border-gray-400 rounded-md h-[40px]"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-[176px] h-[45px] rounded-[10px] bg-[#FF730F] hover:bg-[#e6690e]
                       text-white font-bold text-base px-[38px] py-[13px] self-center"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
