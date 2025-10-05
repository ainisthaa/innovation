"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import React from "react";

interface ActivityCardProps {
  title: string;
  category: string;
  description: string;
  imgSrc?: string; // optional เพื่อใช้ default ได้
  isOpen: boolean;
  views: number;
}

export function ActivityCard({
  title,
  category,
  description,
  imgSrc = "/images/activity.png", // default image
  isOpen,
  views,
}: ActivityCardProps) {
  return (
    <div className="flex bg-white rounded-[15px] shadow-md overflow-hidden w-full h-[200px]">
      {/* 🔸 รูปภาพ */}
      <div className="relative w-[300px] flex-shrink-0">
        <Image
          src={imgSrc}
          alt={title}
          width={300}
          height={200}
          className="object-cover h-full w-full"
        />
        <span
          className={`absolute top-3 left-3 text-white text-sm font-semibold px-3 py-1 rounded-md ${
            isOpen ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {isOpen ? "เปิดรับสมัครแล้ว" : "ปิดรับสมัครแล้ว"}
        </span>
      </div>

      {/* 🔸 เนื้อหา */}
      <div className="flex flex-col justify-between p-5 w-full">
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-gray-500 text-sm mt-1">{category}</p>
          <p className="text-sm mt-2 leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        <div className="flex justify-between items-center mt-3">
          <Heart className="text-[#FF9236]" />
          <p className="text-sm text-right text-gray-700">
            จำนวนการเข้าชม : {views}
          </p>
        </div>
      </div>
    </div>
  );
}
