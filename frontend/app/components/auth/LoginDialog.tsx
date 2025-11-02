"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/app/context/AuthContext";
import pb from "@/lib/pocketbase";

export function LoginDialog() {
  const { login, isLoginOpen, setLoginOpen } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ 1) เรียก API ล็อกอิน PocketBase
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);

      // ✅ 2) บันทึก token + user ลงใน AuthContext
      login(authData.record.id, authData.record.name);

      // ✅ 3) ปิด dialog
      setLoginOpen(false);
    } catch (err: any) {
      console.error("Login failed:", err);
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={setLoginOpen}>
      <DialogContent
        className="w-[502px] h-[480px] rounded-[10px] flex flex-col items-center justify-center px-8"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold mb-6">
            กรุณาเข้าสู่ระบบด้วยบัญชี KMITL
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleLogin} className="w-full flex flex-col space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold text-sm">
              อีเมล (@kmitl.ac.th)
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

          <DialogClose asChild>
            <Button
              type="submit"
              disabled={loading}
              className="w-[176px] h-[45px] rounded-[10px] bg-[#FF730F] hover:bg-[#e6690e]
                         text-white font-bold text-base px-[38px] py-[13px] self-center"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
