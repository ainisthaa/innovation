"use client";

import { useEffect, useState } from "react";
import { ActivityCard } from "@/app/components/home/ActivityCard";

interface RelatedActivitiesProps {
  activities: {
    id: number;
    title: string;
    category: string;
    description: string;
    imgSrc: string;
    isOpen: boolean;
    views: number;
  }[];
}

export function RelatedActivities({ activities }: RelatedActivitiesProps) {
  // 🩶 เก็บรายการโปรดจาก localStorage
  const [favorites, setFavorites] = useState<number[]>([]);

  // ✅ โหลด favorites จาก localStorage เมื่อเปิดหน้า
  useEffect(() => {
    try {
      const saved = localStorage.getItem("favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }, []);

  // 💾 อัปเดต localStorage เมื่อ favorites เปลี่ยน
  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  }, [favorites]);

  // ❤️ toggle favorite (เพิ่ม / ลบ)
  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((fid) => fid !== id)
        : [...prev, id]
    );
  };

  // 🧠 ป้องกัน key ซ้ำ
  const uniqueActivities = activities.map((a, index) => ({
    ...a,
    key: `${a.id}-${index}`,
  }));

  return (
    <section className="max-w-6xl mx-auto px-4 pb-20">
      <h2 className="text-2xl font-bold mb-8 text-center text-black/50">
        กิจกรรมอื่นๆ
      </h2>

      <div className="flex flex-col gap-6">
        {uniqueActivities.map((activity) => (
          <ActivityCard
            key={activity.key}
            id={activity.id}
            title={activity.title}
            category={activity.category}
            description={activity.description}
            imgSrc={activity.imgSrc}
            isOpen={activity.isOpen}
            views={activity.views}
            isFavorite={favorites.includes(activity.id)} // ✅ แสดงสถานะหัวใจ
            onToggleFavorite={handleToggleFavorite} // ✅ toggle เฉพาะอันนั้น
          />
        ))}
      </div>
    </section>
  );
}
