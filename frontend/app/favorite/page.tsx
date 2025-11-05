"use client";

import { useEffect, useState } from "react";
import { ActivityCard } from "@/app/components/home/ActivityCard";
import pb from "@/lib/pocketbase";

export default function FavoritePage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  // ✅ โหลด favorites จาก PocketBase
  const loadFavorites = async () => {
    try {
      // ดึงรายการ favorites พร้อมขยายข้อมูล PostID
      const list = await pb.collection("Favorites").getList(1, 100, {
        sort: "-created",
        expand: "PostID",
      });

      // ✅ แปลงข้อมูลให้อยู่ในรูปแบบเดียวกับ ActivityCard
      const posts = list.items
        .map((fav: any) => {
          const post = fav.expand?.PostID;
          if (!post) return null;
          return {
            id: post.id,
            title: post.Topic || "ไม่มีชื่อกิจกรรม",
            category: post.Type || "ไม่ระบุประเภท",
            description:
              post.ViewDescription || post.AllDescription || "ไม่มีรายละเอียด",
            imgSrc:
              post.Poster && post.Poster !== "N/A"
                ? `${pb.baseUrl}/api/files/${post.collectionId}/${post.id}/${post.Poster}`
                : "/images/activity.png",
            status: post.Verify ? "open" : "closed",
            views: post.ViewCount ?? 0,
          };
        })
        .filter((p) => p !== null);

      setFavorites(list.items.map((f: any) => f.PostID));
      setActivities(posts);
    } catch (err) {
      console.error("❌ โหลดข้อมูล favorites ไม่สำเร็จ:", err);
      setFavorites([]);
      setActivities([]);
    }
  };

  useEffect(() => {
    loadFavorites();

    // ✅ อัปเดต favorites แบบเรียลไทม์จาก event
    const updateListener = () => loadFavorites();
    window.addEventListener("favoritesUpdated", updateListener);
    window.addEventListener("storage", updateListener);

    return () => {
      window.removeEventListener("favoritesUpdated", updateListener);
      window.removeEventListener("storage", updateListener);
    };
  }, []);

  // ❤️ เมื่อกดหัวใจใน ActivityCard
  const handleToggleFavorite = async (id: string) => {
    try {
      // ตรวจว่ามี favorite อยู่แล้วหรือไม่
      const favList = await pb.collection("Favorites").getList(1, 100, {
        filter: `PostID="${id}"`,
      });

      if (favList.items.length > 0) {
        // ถ้ามีอยู่แล้ว → ลบออก
        await pb.collection("Favorites").delete(favList.items[0].id);
      } else {
        // ถ้ายังไม่มี → เพิ่มเข้า
        await pb.collection("Favorites").create({
          PostID: id,
          Notify: false,
        });
      }

      await loadFavorites();
      window.dispatchEvent(new CustomEvent("favoritesUpdated"));
    } catch (err) {
      console.error("❌ toggle favorite error:", err);
    }
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
        <p className="text-center text-gray-500 mt-10">ยังไม่มีรายการโปรด</p>
      )}
    </main>
  );
}
