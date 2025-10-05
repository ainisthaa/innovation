"use client";

import { Mail, Phone, Instagram, Facebook } from "lucide-react";
import Link from "next/link";
import { JSX } from "react";

export function Footer(): JSX.Element {
  return (
    <footer className="bg-white border-t border-gray-200 py-14">
      {/* แถวบน: โลโก้ซ้าย + หัวข้อกลาง */}
      <div className="relative max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* โลโก้ */}
        <Link
          href="/"
          className="flex flex-col items-start leading-tight select-none"
        >
          <span
            className="text-[2.6rem] font-extrabold text-[#E35205] tracking-[0.1em] leading-none"
            style={{ lineHeight: "0.9" }}
          >
            R-SA
          </span>
          <span className="text-sm font-extrabold text-black mt-[2px] tracking-tight">
            พระจอมเกล้าลาดกระบัง
          </span>
        </Link>

        {/* หัวข้อช่องทางการติดต่อ (จัดกลางแนวนอนจริงๆ) */}
        <h3 className="absolute left-1/2 transform -translate-x-1/2 text-[18px] font-semibold text-center">
          ช่องทางการติดต่อ
        </h3>
      </div>

      {/* แถวกลาง: รายการช่องทาง */}
      <div className="max-w-6xl mx-auto px-6 mt-10 flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-6 text-sm">
          <div className="flex items-center space-x-2">
            <Mail size={18} />
            <Link href="mailto:r-sa@kmitl.ac.th" className="hover:underline">
              r-sa@kmitl.ac.th
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <Phone size={18} />
            <span>012-345-6789</span>
          </div>

          <div className="flex items-center space-x-2">
            <Instagram size={18} />
            <Link
              href="https://instagram.com/rsakmitl"
              target="_blank"
              className="hover:underline"
            >
              rsakmitl
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <Facebook size={18} />
            <Link
              href="https://facebook.com/rsakmitl"
              target="_blank"
              className="hover:underline"
            >
              rsakmitl
            </Link>
          </div>
        </div>
      </div>

      {/* เส้นคั่น */}
      <div className="max-w-6xl mx-auto px-6 mt-12 border-t border-black"></div>

      {/* ที่อยู่ */}
      <p className="text-center text-sm text-gray-700 mt-6 px-4 leading-relaxed">
        สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง เลขที่ 1 ซอยฉลองกรุง 1 แขวงลาดกระบัง
        เขตลาดกระบัง กรุงเทพฯ 10520
      </p>
    </footer>
  );
}
