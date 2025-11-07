// app/components/home/ActivityCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import pb, { Favorite, isAuthenticated, getCurrentUserId } from "@/lib/pocketbase";

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
    if (!user) {
      setIsFavorite(false);
      return;
    }

    const checkFavorite = async () => {
      try {
        const userId = getCurrentUserId();
        if (!userId) return;

        const favs = await pb.collection("Favorites").getList<Favorite>(1, 1, {
          filter: `UserID="${userId}" && PostID="${id}"`,
          requestKey: `check_fav_${id}_${Date.now()}`,
        });

        setIsFavorite(favs.items.length > 0);
      } catch (err: any) {
        console.error("❌ Error checking favorite:", err);
      }
    };

    checkFavorite();
  }, [id, user]);

  // ❤️ toggle favorite
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      openLogin();
      return;
    }

    const userId = getCurrentUserId();
    if (!userId) {
      alert("⚠️ กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
      return;
    }

    setLoading(true);

    try {
      // ✅ ตรวจสอบว่ามี favorite อยู่แล้วหรือไม่
      const existing = await pb.collection("Favorites").getList<Favorite>(1, 1, {
        filter: `UserID="${userId}" && PostID="${id}"`,
        requestKey: `toggle_fav_${id}_${Date.now()}`,
      });

      if (existing.items.length > 0) {
        // ✅ ลบ favorite
        await pb.collection("Favorites").delete(existing.items[0].id);
        setIsFavorite(false);
        console.log("✅ Removed from favorites");
      } else {
        // ✅ เพิ่ม favorite
        console.log("🔍 Attempting to create favorite with:", {
          UserID: userId,
          PostID: id,
          Notify: false,
        });

        try {
          // ✅ CRITICAL FIX: ส่งข้อมูลแบบ FormData แทน JSON
          const formData = new FormData();
          formData.append("UserID", userId);
          formData.append("PostID", id);
          formData.append("Notify", "false");

          const newFavorite = await pb.collection("Favorites").create(formData);
          
          setIsFavorite(true);
          console.log("✅ Added to favorites:", newFavorite);
        } catch (createErr: any) {
          console.error("❌ Create favorite error:", createErr);
          
          // ✅ แสดง error details แบบละเอียด
          if (createErr?.response?.data) {
            console.error("📋 Error data:", JSON.stringify(createErr.response.data, null, 2));
          }
          
          // ✅ ลองอีกครั้งด้วย JSON ธรรมดา (บาง PocketBase version ต้องการ JSON)
          try {
            const newFavorite = await pb.collection("Favorites").create({
              UserID: userId,
              PostID: id,
              Notify: false,
            }, {
              // ส่ง header เป็น JSON
              headers: {
                "Content-Type": "application/json",
              },
            });
            
            setIsFavorite(true);
            console.log("✅ Added to favorites (JSON method):", newFavorite);
          } catch (jsonErr: any) {
            console.error("❌ JSON method also failed:", jsonErr);
            
            // ลองวิธีสุดท้าย: ใช้ SDK อย่างเดียว ไม่ส่ง options
            try {
              const record = await pb.send("/api/collections/Favorites/records", {
                method: "POST",
                body: {
                  UserID: userId,
                  PostID: id,
                  Notify: false,
                },
              });
              
              setIsFavorite(true);
              console.log("✅ Added to favorites (manual API):", record);
            } catch (apiErr) {
              console.error("❌ Manual API method failed:", apiErr);
              throw createErr; // โยน error แรกออกมา
            }
          }
        }
      }

      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent("favoritesUpdated"));
    } catch (err: any) {
      console.error("❌ toggleFavorite error:", err);
      
      // ✅ สร้าง error message ที่อ่านง่าย
      let errorMessage = "ไม่สามารถอัปเดตรายการโปรดได้";
      
      if (err?.response?.data) {
        const data = err.response.data;
        
        // แสดง field validation errors
        if (data.data) {
          const fieldErrors = Object.entries(data.data)
            .map(([field, error]) => `${field}: ${JSON.stringify(error)}`)
            .join("\n");
          errorMessage = `ข้อมูลไม่ถูกต้อง:\n${fieldErrors}`;
        } else if (data.message) {
          errorMessage = data.message;
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      console.error("📋 Full error:", {
        message: err?.message,
        status: err?.status,
        response: err?.response,
        data: err?.response?.data,
      });
      
      alert(`เกิดข้อผิดพลาด: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const badge =
    status === "open"
      ? { text: "เปิดรับสมัครแล้ว", bg: "bg-green-500 text-white" }
      : status === "closed"
      ? { text: "ปิดรับสมัครแล้ว", bg: "bg-red-500 text-white" }
      : { text: "เตรียมเปิดรับสมัคร", bg: "bg-gray-400 text-white" };

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
              unoptimized
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