"use client";

import { useEffect, useState } from "react";
import { ActivityCard } from "@/app/components/home/ActivityCard";
import pb from "@/lib/pocketbase";

export default function FavoritePage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    const userId = pb.authStore.model?.id;
    if (!userId) {
      console.warn("⚠️ ยังไม่ได้ล็อกอิน ไม่สามารถโหลด favorites ได้");
      setFavorites([]);
      setActivities([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const list = await pb.collection("Favorites").getList(1, 100, {
        sort: "-created",
        expand: "PostID",
        filter: `UserID="${userId}"`,
        requestKey: null,
      });

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
        .filter(Boolean);

      setFavorites(list.items.map((f: any) => f.PostID));
      setActivities(posts);
    } catch (err) {
      console.error("❌ โหลดข้อมูล favorites ไม่สำเร็จ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
    const updateListener = () => loadFavorites();
    window.addEventListener("favoritesUpdated", updateListener);
    return () => window.removeEventListener("favoritesUpdated", updateListener);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600">
        กำลังโหลดรายการโปรด...
      </main>
    );
  }

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
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">ยังไม่มีรายการโปรด</p>
      )}
    </main>
  );
}
