"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ChevronDown } from "lucide-react";

interface SettingDialogProps {
  user: { studentId: string; name: string };
  onLogout: () => void;
}

export function SettingDialog({ user, onLogout }: SettingDialogProps): JSX.Element {
  const [notify, setNotify] = React.useState(false);

  return (
    <Dialog>
      {/* ปุ่มเปิด popup */}
      <DialogTrigger asChild>
        <button
          className="flex items-center justify-between w-[176px] h-[45px] border border-[#E35205] 
                     rounded-[10px] px-6 text-[#E35205] font-semibold hover:bg-[#fff3ed] transition-all"
        >
          {user.studentId}
          <ChevronDown size={18} />
        </button>
      </DialogTrigger>

      {/* เนื้อหา popup */}
      <DialogContent
        className="w-[246px] h-[171px] rounded-[5px] flex flex-col items-center justify-center space-y-4"
        aria-describedby={undefined}
      >

        <p className="font-semibold text-base">{user.name}</p>

        {/* Toggle การแจ้งเตือน */}
        <div className="flex items-center justify-between w-[90%]">
          <span className="font-semibold text-sm">การแจ้งเตือน</span>
          <div
            onClick={() => setNotify(!notify)}
            className={`relative w-[70px] h-[27px] rounded-full border  cursor-pointer transition-colors ${
              notify ? "bg-[#FF9236]" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-[2px] left-[2px] w-[23px] h-[23px] bg-white rounded-full shadow-md transition-transform duration-300 ${
                notify ? "translate-x-[43px]" : "translate-x-0"
              }`}
            />
          </div>
        </div>

        {/* ปุ่มออกจากระบบ */}
        <button
          onClick={onLogout}
          className="text-[#E35205] font-semibold hover:underline mt-2"
        >
          ออกจากระบบ
        </button>
      </DialogContent>
    </Dialog>
  );
}
