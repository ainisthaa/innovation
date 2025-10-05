"use client";

import { useEffect, useState } from "react";
import { ActivityCard } from "../components/home/ActivityCard";

export default function FavoritePage() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  // 🔹 mock data จำลอง (จะถูกแทนที่ด้วยข้อมูลจาก backend ภายหลัง)
  const allActivities = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `กิจกรรมที่ ${i + 1}`,
    category: i % 2 === 0 ? "ค่ายคอมพิวเตอร์" : "กิจกรรมจิตอาสา",
    description:
      "รายละเอียดกิจกรรม Lorem ipsum dolor sit amet consectetur adipiscing elit.",
    imgSrc: "/images/activity.png",
    isOpen: i % 2 === 0,
    views: 100 + i * 5,
  }));

  // 🧠 โหลด favorites จาก localStorage ตอนเปิดหน้า
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(stored);
    setActivities(allActivities.filter((a) => stored.includes(a.id)));
  }, []);

  // ❤️ toggle favorite (คลิกหัวใจเพื่อลบออก)
  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((fid) => fid !== id)
        : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(updated));
      setActivities(allActivities.filter((a) => updated.includes(a.id)));
      return updated;
    });
  };

  return (
    <main className="min-h-screen bg-[#F8F8F8] py-10 px-4">
      <h1 className="text-2xl font-bold text-center text-black mb-8">
        รายการโปรดของฉัน
      </h1>

      {activities.length > 0 ? (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
          {activities.map((a) => (
            <ActivityCard
              key={a.id}
              {...a}
              isFavorite={favorites.includes(a.id)} // ✅ หัวใจทึบ
              onToggleFavorite={handleToggleFavorite} // ✅ เอาออกได้
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          ยังไม่มีรายการโปรด
        </p>
      )}
    </main>
  );
}
