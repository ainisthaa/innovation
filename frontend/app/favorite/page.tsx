"use client";

import { useEffect, useState } from "react";
import { ActivityCard } from "@/app/components/home/ActivityCard";

export default function FavoritePage() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  // 🧩 mock ข้อมูลกิจกรรมทั้งหมด (ในระบบจริงจะมาจาก API)
  const allActivities = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `กิจกรรมที่ ${i + 1}`,
    category: i % 2 === 0 ? "ค่ายคอมพิวเตอร์" : "กิจกรรมจิตอาสา",
    description:
      "รายละเอียดกิจกรรม Lorem ipsum dolor sit amet consectetur adipiscing elit.",
    imgSrc: "/images/activity.png",
    status: i % 3 === 0 ? "open" : i % 2 === 0 ? "open" : "open",
    views: 100 + i * 5,
  }));

  // ✅ โหลด favorites จาก localStorage
  const loadFavorites = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(stored);
      setActivities(allActivities.filter((a) => stored.includes(a.id)));
    } catch (err) {
      console.error("Error reading favorites:", err);
    }
  };

  useEffect(() => {
    loadFavorites();

    // ✅ ฟัง event จากทุกหน้า (ทั้งในแท็บเดียวและข้ามแท็บ)
    const updateListener = () => loadFavorites();
    window.addEventListener("favoritesUpdated", updateListener);
    window.addEventListener("storage", updateListener);

    return () => {
      window.removeEventListener("favoritesUpdated", updateListener);
      window.removeEventListener("storage", updateListener);
    };
  }, []);

  // ❤️ เมื่อกดหัวใจใน ActivityCard
  const handleToggleFavorite = (id: number) => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updated = stored.includes(id)
      ? stored.filter((fid: number) => fid !== id)
      : [...stored, id];

    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
    setActivities(allActivities.filter((a) => updated.includes(a.id)));

    // ✅ แจ้งให้ทุกหน้าทราบทันที
    window.dispatchEvent(new CustomEvent("favoritesUpdated"));
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
              id={a.id}
              title={a.title}
              category={a.category}
              description={a.description}
              imgSrc={a.imgSrc}
              status={a.status}
              views={a.views}
              isFavorite={favorites.includes(a.id)} // ✅ แสดงหัวใจเต็ม
              onToggleFavorite={handleToggleFavorite} // ✅ ลบ/เพิ่มจากหน้านี้ได้
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
