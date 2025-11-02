"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

interface ActivityCardProps {
  id: number;
  title: string;
  category: string;
  description: string;
  imgSrc?: string;
  status?: "upcoming" | "open" | "closed";
  views: number;
}

export function ActivityCard({
  id,
  title,
  category,
  description,
  imgSrc = "/images/activity.png",
  status = "open",
  views,
}: ActivityCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { user, openLogin } = useAuth();

  // ✅ โหลดสถานะจาก localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(stored.includes(id));
    } catch (e) {
      console.error("Error loading favorites", e);
    }
  }, [id]);

  // ❤️ toggle favorite
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      openLogin();
      return;
    }

    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updated = stored.includes(id)
      ? stored.filter((fid: number) => fid !== id)
      : [...stored, id];

    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(updated.includes(id));

    // ✅ แจ้งให้ทุกหน้าอัปเดต
    window.dispatchEvent(new CustomEvent("favoritesUpdated"));
  };

  // ป้ายสถานะ
  const badge =
    status === "open"
      ? { text: "เปิดรับสมัครแล้ว", bg: "bg-green-500 text-black" }
      : status === "closed"
      ? { text: "ปิดรับสมัครแล้ว", bg: "bg-red-500 text-black" }
      : { text: "เตรียมเปิดรับสมัคร", bg: "bg-gray-400 text-black" };

  return (
    <div className="relative">
      <Link
        href={`/activities/${id}`}
        className="block hover:scale-[1.01] transition-transform duration-200"
      >
        <div className="flex bg-white rounded-[15px] shadow-md overflow-hidden w-full h-[200px] cursor-pointer relative">
          {/* รูปภาพ */}
          <div className="relative w-[300px] flex-shrink-0">
            <Image
              src={imgSrc}
              alt={title}
              width={300}
              height={200}
              className="object-cover h-full w-full"
            />
            <span
              className={`absolute top-3 left-3 text-sm font-semibold px-3 py-1 rounded-md ${badge.bg}`}
            >
              {badge.text}
            </span>
          </div>

          {/* เนื้อหา */}
          <div className="flex flex-col justify-between p-5 w-full">
            <div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-gray-500 text-sm mt-1">{category}</p>
              <p className="text-sm mt-2 leading-relaxed line-clamp-3">
                {description}
              </p>
            </div>

            <div className="flex justify-between items-center mt-3">
              <motion.button
                onClick={toggleFavorite}
                whileTap={{ scale: 1.3 }}
                transition={{ type: "spring", stiffness: 300 }}
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
