"use client";

import { useEffect, useState } from "react";
import { ActivityCard } from "@/app/components/home/ActivityCard";

interface RelatedActivitiesProps {
  activities: {
    id: string; // ✅ เปลี่ยนเป็น string ให้ตรงกับ PocketBase
    title: string;
    category: string;
    description: string;
    imgSrc: string;
    status?: "upcoming" | "open" | "closed";
    views: number;
  }[];
}

export function RelatedActivities({ activities }: RelatedActivitiesProps) {
  const [favorites, setFavorites] = useState<string[]>([]); // ✅ เปลี่ยนเป็น string

  // ✅ โหลด favorites จาก localStorage
  const loadFavorites = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (Array.isArray(stored)) {
        setFavorites(stored);
      }
    } catch (err) {
      console.error("❌ โหลด favorites ไม่สำเร็จ:", err);
    }
  };

  // ✅ โหลดครั้งแรก + sync กับ event
  useEffect(() => {
    loadFavorites();
    window.addEventListener("favoritesUpdated", loadFavorites);
    window.addEventListener("storage", loadFavorites);

    return () => {
      window.removeEventListener("favoritesUpdated", loadFavorites);
      window.removeEventListener("storage", loadFavorites);
    };
  }, []);

  if (!activities || activities.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold mb-8 text-center text-black/50">
          กิจกรรมอื่นๆ
        </h2>
        <p className="text-center text-gray-500">ยังไม่มีกิจกรรมอื่นในระบบ</p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 pb-20">
      <h2 className="text-2xl font-bold mb-8 text-center text-black/60">
        กิจกรรมอื่นๆ
      </h2>

      <div className="flex flex-col gap-6">
        {activities.map((a) => (
          <ActivityCard
            key={a.id}
            id={a.id}
            title={a.title}
            category={a.category}
            description={a.description}
            imgSrc={a.imgSrc}
            status={a.status}
            views={a.views}
            isFavorite={favorites.includes(a.id)} // ✅ ใช้ string match
            onToggleFavorite={() => {
              const updated = favorites.includes(a.id)
                ? favorites.filter((fid) => fid !== a.id)
                : [...favorites, a.id];
              localStorage.setItem("favorites", JSON.stringify(updated));
              setFavorites(updated);
              window.dispatchEvent(new Event("favoritesUpdated"));
            }}
          />
        ))}
      </div>
    </section>
  );
}
