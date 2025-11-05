"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import pb from "@/lib/pocketbase";

interface ActivityCardProps {
  id: string;
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
  const [loading, setLoading] = useState(false);
  const { user, openLogin } = useAuth();

  // ✅ โหลดสถานะ favorite จาก PocketBase
  useEffect(() => {
    if (!user) return;

    const checkFavorite = async () => {
      try {
        const userId = pb.authStore.model?.id;
        if (!userId) return;

        const favs = await pb.collection("Favorites").getList(1, 1, {
          filter: `UserID="${userId}" && PostID="${id}"`,
          requestKey: null,
        });

        setIsFavorite(favs.items.length > 0);
      } catch (err) {
        console.error("❌ Error checking favorite:", err);
      }
    };

    checkFavorite();
  }, [id, user]);

  // ❤️ toggle favorite
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return openLogin();

    const userId = pb.authStore.model?.id;
    if (!userId) return alert("⚠️ กรุณาเข้าสู่ระบบใหม่อีกครั้ง");

    console.log("🧭 toggleFavorite", { UserID: userId, PostID: id });
    setLoading(true);

    try {
      const existing = await pb.collection("Favorites").getList(1, 1, {
        filter: `UserID="${userId}" && PostID="${id}"`,
        requestKey: null,
      });

      if (existing.items.length > 0) {
        await pb.collection("Favorites").delete(existing.items[0].id);
        setIsFavorite(false);
      } else {
        await pb.collection("Favorites").create({
          UserID: userId,
          PostID: id,
          Notify: false,
        });
        setIsFavorite(true);
      }

      window.dispatchEvent(new CustomEvent("favoritesUpdated"));
    } catch (err: any) {
      console.error("❌ toggleFavorite error:", err);
      console.warn("📦 Error detail:", err?.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

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
          <div className="relative w-[300px] flex-shrink-0">
            <Image
              src={imgSrc}
              alt={title}
              width={300}
              height={200}
              className="object-cover h-full w-full"
              priority
            />
            <span
              className={`absolute top-3 left-3 text-sm font-semibold px-3 py-1 rounded-md ${badge.bg}`}
            >
              {badge.text}
            </span>
          </div>

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
                disabled={loading}
                onClick={toggleFavorite}
                whileTap={{ scale: 1.3 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="disabled:opacity-50"
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
