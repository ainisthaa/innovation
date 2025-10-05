"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface SettingDropdownProps {
  user: { studentId: string; name: string };
  onLogout: () => void;
}

export function SettingDropdown({ user, onLogout }: SettingDropdownProps) {
  const [notify, setNotify] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false); // ✅ state สำหรับเปิด/ปิด

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center justify-between w-[246px] h-[45px] border border-[#E35205] 
                     rounded-[10px] px-6 text-[#E35205] font-semibold hover:bg-[#fff3ed] transition-all"
        >
          {user.studentId}
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />} {/* ✅ เปลี่ยนทิศลูกศร */}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-[246px] h-[171px] rounded-[5px] border border-[#E35205] bg-white 
                   shadow-lg p-4 flex flex-col items-center justify-center space-y-4"
      >
        {/* ชื่อผู้ใช้ */}
        <p className="font-semibold text-base">{user.name}</p>

        {/* Toggle การแจ้งเตือน */}
        <div className="flex items-center justify-between w-[90%]">
          <span className="font-semibold text-sm">การแจ้งเตือน</span>
          <div
            onClick={() => setNotify(!notify)}
            className={`relative w-[70px] h-[27px] rounded-full border cursor-pointer transition-colors ${
              notify ? "bg-[#FF9236]" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-[2px] left-[2px] w-[20px] h-[20px] bg-white rounded-full shadow-md transition-transform duration-300 ${
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
