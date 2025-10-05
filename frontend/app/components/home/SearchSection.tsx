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
      {/* แถวบน - ช่องค้นหา + ปุ่มค้นหา */}
      <div className="flex w-[90%] items-center justify-between space-x-3">
        <Input
          type="text"
          placeholder="ชื่อกิจกรรม / คณะ / สาขา"
          className="bg-white flex-1 rounded-full h-[45px] px-6 text-gray-700 placeholder:text-gray-500 border-none focus:ring-0 focus:outline-none"
        />
        <Button
          className="bg-white text-black hover:bg-gray-100 rounded-full h-[45px] px-6 font-medium shadow-sm"
        >
          ค้นหา
        </Button>
      </div>

      {/* แถวล่าง - Dropdown 3 ช่อง */}
       <div className="flex w-[90%] justify-start items-center gap-4 mt-1">
        {["คณะ", "สาขา", "ประเภท"].map((label, index) => (
          <div
            key={index}
            className="relative bg-white rounded-full w-[278px] h-[32px]
                       flex items-center justify-between px-6 text-gray-700 cursor-pointer border-none"
          >
            <span className="text-gray-500 text-sm">{label}</span>
            <ChevronDown className="text-black" size={16} />
          </div>
        ))}
      </div>
    </div>
  );
}