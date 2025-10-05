"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { JSX, useState } from "react";
import { LoginDialog } from "../auth/LoginDialog";
import { SettingDialog } from "../auth/SettingDialog";

export function Navbar(): JSX.Element {
  const pathname = usePathname();
  const [user, setUser] = useState<{ studentId: string; name: string } | null>(
    null
  );

  const links = [
    { href: "/", label: "หน้าหลัก" },
    { href: "/calendar", label: "ปฏิทิน" },
    { href: "/volunteer", label: "ลงกิจกรรม" },
  ];

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b border-gray-100">
      {/* โลโก้ */}
      <Link href="/" className="flex flex-col leading-tight select-none">
        <span className="text-2xl font-extrabold text-[#E35205] tracking-tight">
          R-SA
        </span>
        <span className="text-xs font-semibold text-black mt-[-4px]">
          พระจอมเกล้าลาดกระบัง
        </span>
      </Link>

      {/* เมนูหลัก */}
      <div className="flex items-center space-x-10">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-[#E35205]",
              pathname === link.href ? "text-[#E35205]" : "text-black"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* ปุ่ม login หรือโปรไฟล์ */}
      <div className="text-sm font-medium">
        {user ? (
          <SettingDialog user={user} onLogout={() => setUser(null)} />
        ) : (
          <LoginDialog
            onLogin={(id, name) => setUser({ studentId: id, name: name })}
          />
        )}
      </div>
    </nav>
  );
}
