"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { LoginDialog } from "../auth/LoginDialog";
import { SettingDropdown } from "../auth/SettingDropdown";

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ studentId: string; name: string } | null>(
    null
  );

  const baseLinks = [
    { href: "/", label: "หน้าหลัก" },
    { href: "/calendar", label: "ปฏิทิน" },
    { href: "/volunteer", label: "ลงกิจกรรม" },
  ];

  const links = user
    ? [...baseLinks, { href: "/favorite", label: "รายการโปรด" }]
    : baseLinks;

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-white shadow-sm border-b border-gray-100 relative">
      {/* โลโก้ด้านซ้าย */}
      <div className="flex-1 flex justify-start">
        <Link
          href="/"
          className="flex flex-col items-start leading-tight select-none"
        >
          <span
            className="text-[2.4rem] font-extrabold text-[#E35205] tracking-[0.1em] leading-none"
            style={{ lineHeight: "0.9" }}
          >
            R-SA
          </span>
          <span className="text-sm font-extrabold text-black mt-[2px] tracking-tight">
            พระจอมเกล้าลาดกระบัง
          </span>
        </Link>
      </div>

      {/* เมนูตรงกลาง */}
      <div className="flex-1 flex justify-center">
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
      </div>

      {/* ปุ่มขวาสุด */}
      <div className="flex-1 flex justify-end text-sm font-medium">
       {user ? (
      <SettingDropdown user={user} onLogout={() => setUser(null)} />
    ) : (
      <LoginDialog onLogin={(id, name) => setUser({ studentId: id, name })} />
    )}

      </div>
    </nav>
  );
}
