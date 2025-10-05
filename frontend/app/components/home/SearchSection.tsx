"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import React from "react";

export default function SearchBar() {
  return (
    <div
      className="w-[1058px] h-[136px] bg-[#FF9236] rounded-[20px] mx-auto 
                 shadow-[5px_5px_4px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center space-y-4"
    >

       {/* 🔍 แถวบน - ช่องค้นหา + ปุ่มค้นหา */}
        <div className="flex items-center justify-center gap-3">
        {/* กล่อง Input */}
        <input
            type="text"
            placeholder="ชื่อกิจกรรม / คณะ / สาขา"
            className="w-[866px] h-[40px] bg-white rounded-full px-6 
                    text-gray-700 placeholder:text-gray-500 
                    border border-gray-300 shadow-sm focus:outline-none focus:border-[#FF9236]"
        />

        {/* ปุ่มค้นหา */}
        <button
            className="w-[102px] h-[40px] bg-white rounded-full shadow-sm 
                    border border-gray-300 font-medium text-black hover:bg-gray-100 transition"
        >
            ค้นหา
        </button>
        </div>




      {/* แถวล่าง - Dropdown 3 ช่อง */}
      
        <div className="flex justify-start gap-[16px] mt-[6px] ml-[-115px]" style={{ width: "866px" }}>

        {["คณะ", "สาขา", "ประเภท"].map((label, index) => (
            <div
            key={index}
            className="relative bg-white rounded-full flex items-center justify-between 
                        px-6 text-gray-700 cursor-pointer border-none shadow-sm"
            style={{
                width: "278px", // ✅ กว้างเท่ากันทั้งสามช่อง
                height: "32px",
            }}
            >
            <span className="text-gray-500 text-sm">{label}</span>
            <ChevronDown className="text-black" size={16} />
            </div>
        ))}
        </div>

    </div>
  );
}