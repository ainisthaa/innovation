"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JSX } from "react";

interface LoginDialogProps {
  onLogin?: (studentId: string, name: string) => void;
}

export function LoginDialog({ onLogin }: LoginDialogProps): JSX.Element {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // จำลอง login
    const fakeId = "66050103";
    const fakeName = "สมชาย สุวรรณศรี";
    onLogin?.(fakeId, fakeName);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-[#E35205] font-semibold hover:underline cursor-pointer">
          เข้าสู่ระบบ
        </span>
      </DialogTrigger>

      <DialogContent
        className="w-[502px] h-[471px] rounded-[10px] flex flex-col items-center justify-center px-8"
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
            />
          </div>

          <DialogClose asChild>
            <Button
              type="submit"
              className="w-[176px] h-[45px] rounded-[10px] bg-[#FF730F] hover:bg-[#e6690e]
                         text-white font-bold text-base px-[38px] py-[13px] self-center"
            >
              เข้าสู่ระบบ
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
