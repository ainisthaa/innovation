"use client";

import Image from "next/image";
import { Pencil, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import pb from "@/lib/pocketbase";

interface ActivityDetailProps {
  activity: {
    id?: string;
    title: string;
    category: string;
    description: string;
    organizer: string;
    contact: string;
    place: string;
    period: string;
    requirement: string;
    startDate: string;
    endDate: string;
    maxParticipants: number;
    isOpen: boolean;
    imgSrc: string;
  };
}

export function ActivityDetail({ activity }: ActivityDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { user, openLogin } = useAuth();

  useEffect(() => {
    if (!activity.id || !user) return;

    const checkFavorite = async () => {
      try {
        const fav = await pb.collection("Favorites").getList(1, 1, {
          filter: `UserID="${pb.authStore.model?.id}" && PostID="${activity.id}"`,
          requestKey: null,
        });
        setIsFavorite(fav.items.length > 0);
      } catch (err) {
        console.error("❌ checkFavorite error:", err);
      }
    };

    checkFavorite();
  }, [activity.id, user]);

  const toggleFavorite = async () => {
    if (!user) return openLogin();
    const userId = pb.authStore.model?.id;

    console.log("🧭 toggleFavorite", { UserID: userId, PostID: activity.id });

    try {
      const fav = await pb.collection("Favorites").getList(1, 1, {
        filter: `UserID="${userId}" && PostID="${activity.id}"`,
        requestKey: null,
      });

      if (fav.items.length > 0) {
        await pb.collection("Favorites").delete(fav.items[0].id);
        setIsFavorite(false);
      } else {
        await pb.collection("Favorites").create({
          UserID: userId,
          PostID: activity.id,
          Notify: false,
        });
        setIsFavorite(true);
      }

      window.dispatchEvent(new CustomEvent("favoritesUpdated"));
    } catch (err) {
      console.error("❌ toggleFavorite error:", err);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-10 text-gray-800">
      <Image
        src={activity.imgSrc}
        alt={activity.title}
        width={1000}
        height={400}
        className="rounded-lg shadow-md w-full object-cover"
        priority
      />

      <div className="flex justify-center mt-5">
        <span
          className={`text-sm font-semibold px-4 py-1 rounded-md ${
            activity.isOpen ? "bg-green-400" : "bg-red-400"
          } text-black`}
        >
          {activity.isOpen ? "เปิดรับสมัครแล้ว" : "ปิดรับสมัครแล้ว"}
        </span>
      </div>

      <h1 className="text-center text-2xl font-bold mt-5">{activity.title}</h1>

      <div className="mt-10 space-y-3 text-[16px]">
        <p><strong>ประเภทกิจกรรม:</strong> {activity.category}</p>
        <p><strong>สถานที่จัดกิจกรรม:</strong> {activity.place}</p>
        <p><strong>ช่วงเวลากิจกรรม:</strong> {activity.period}</p>
        <p><strong>คุณสมบัติผู้เข้าร่วม:</strong> {activity.requirement}</p>
      </div>

      <div className="flex justify-center gap-10 mt-10 flex-wrap">
        <button
          onClick={() => {
            if (!user) return openLogin();
            alert("✅ ไปหน้าลงทะเบียนได้เลย (ต่อเชื่อมภายหลัง)");
          }}
          className="w-[335px] h-[130px] bg-[#F7F7F7] border border-black/25 rounded-[20px] 
                     flex flex-col items-center justify-center hover:shadow-md transition-all"
        >
          <span className="font-bold text-xl text-black mb-2">ลงทะเบียน</span>
          <Pencil size={38} strokeWidth={2.3} className="text-black" />
        </button>

        <motion.button
          onClick={toggleFavorite}
          whileTap={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-[335px] h-[130px] bg-[#F7F7F7] border border-black/25 rounded-[20px]
                     flex flex-col items-center justify-center hover:shadow-md transition-all"
        >
          <span className="font-bold text-xl text-black mb-2">
            {isFavorite ? "ลบออกจากรายการโปรด" : "เพิ่มลงรายการโปรด"}
          </span>
          <Heart
            size={42}
            strokeWidth={2.5}
            className={`transition-all duration-300 ${
              isFavorite ? "fill-[#FF9236] text-[#FF9236]" : "text-[#FF9236]"
            }`}
          />
        </motion.button>
      </div>

      <hr className="my-10 border-t border-gray-300" />
    </section>
  );
}
