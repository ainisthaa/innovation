"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

interface ActivityCardProps {
  id: number;
  title: string;
  category: string;
  description: string;
  imgSrc?: string;
  isOpen: boolean;
  views: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
}

export function ActivityCard({
  id,
  title,
  category,
  description,
  imgSrc = "/images/activity.png",
  isOpen,
  views,
  isFavorite = false,
  onToggleFavorite,
}: ActivityCardProps) {
  return (
    <div className="relative">
      {/* คลิกที่การ์ด → ไปหน้ารายละเอียด */}
      <Link
        href={`/activities/${id}`}
        className="block hover:scale-[1.01] transition-transform duration-200"
      >
        <div className="flex bg-white rounded-[15px] shadow-md overflow-hidden w-full h-[200px] cursor-pointer relative">
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

            {/* 🔸 ส่วนล่าง */}
            <div className="flex justify-between items-center mt-3">
              {/* ปุ่มหัวใจ (ไม่ให้ trigger ลิงก์) */}
              <motion.button
                onClick={(e) => {
                  e.preventDefault(); // ป้องกันเปลี่ยนหน้า
                  e.stopPropagation(); // ป้องกันคลิกลิงก์
                  onToggleFavorite?.(id);
                }}
                whileTap={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="cursor-pointer"
              >
                <Heart
                  size={22}
                  className={`transition-colors ${
                    isFavorite
                      ? "fill-[#FF9236] text-[#FF9236]"
                      : "text-[#FF9236]"
                  }`}
                />
              </motion.button>

              <p className="text-sm text-right text-gray-700">
                จำนวนการเข้าชม : {views}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
