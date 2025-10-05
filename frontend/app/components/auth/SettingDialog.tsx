"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { JSX } from "react";

interface SettingDialogProps {
  user: { studentId: string; name: string };
  onLogout: () => void;
}

export function SettingDialog({
  user,
  onLogout,
}: SettingDialogProps): JSX.Element {
  const [notify, setNotify] = React.useState(false);

  return (
    <Dialog>
      {/* ปุ่มเปิด popup */}
      <DialogTrigger asChild>
        <button
          className="flex items-center justify-between w-[180px] h-[45px] 
                     border border-[#E35205] rounded-[10px] px-[20px] 
                     text-[#E35205] font-bold text-base"
        >
          <span>{user.studentId}</span>
          <ChevronDown size={20} strokeWidth={2} className="text-[#E35205]" />
        </button>
      </DialogTrigger>

      {/* Popup Setting */}
      <DialogContent
        className="w-[246px] h-[171px] rounded-[5px] flex flex-col justify-center items-center space-y-4 p-4"
        aria-describedby={undefined}
      >
      

        {/* เนื้อหา */}
        <div className="flex flex-col items-center space-y-3 w-full">
          {/* ชื่อผู้ใช้ */}
          <p className="text-base font-bold">{user.name}</p>

          {/* toggle การแจ้งเตือน */}
          <div className="flex items-center justify-between w-[90%]">
            <span className="font-semibold text-sm">การแจ้งเตือน</span>
            <Switch
              checked={notify}
              onCheckedChange={setNotify}
              className="data-[state=checked]:bg-[#FF9236] data-[state=unchecked]:bg-gray-300
                         w-[70px] h-[27px] border border-[#FF9236] rounded-full transition-colors"
            />
          </div>

          {/* ปุ่มออกจากระบบ */}
          <Button
            onClick={onLogout}
            className="bg-transparent text-[#E35205] font-bold text-base mt-2 hover:bg-transparent hover:underline"
          >
            ออกจากระบบ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
