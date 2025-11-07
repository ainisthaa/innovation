// app/favorite/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ActivityCard } from "@/app/components/home/ActivityCard";
import pb, { Favorite, Post, getImageUrl, calculatePostStatus } from "@/lib/pocketbase";
import { useAuth } from "@/app/context/AuthContext";

interface ActivityData {
  id: string;
  title: string;
  category: string;
  description: string;
  imgSrc: string;
  status: "upcoming" | "open" | "closed";
  views: number;
}

export default function FavoritePage() {
  const { user, openLogin } = useAuth();
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    const userId = pb.authStore.model?.id;
    
    if (!userId) {
      console.warn("⚠️ ยังไม่ได้ล็อกอิน ไม่สามารถโหลด favorites ได้");
      setActivities([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // ✅ ดึง favorites พร้อม expand PostID และ Type
      const list = await pb.collection("Favorites").getList<Favorite>(1, 100, {
        sort: "-created",
        expand: "PostID,PostID.Type",
        filter: `UserID="${userId}"`,
        requestKey: `favorites_${Date.now()}`,
      });

      const mappedActivities: ActivityData[] = list.items
        .map((fav) => {
          const post = fav.expand?.PostID as Post | undefined;
          if (!post) return null;

          // ✅ ใช้ calculatePostStatus แทน
          const status = calculatePostStatus(post);
          
          // ✅ ดึงชื่อ Type จาก expand
          const typeName = post.expand?.Type?.TypeName || post.Type || "ไม่ระบุประเภท";

          return {
            id: post.id,
            title: post.Topic || "ไม่มีชื่อกิจกรรม",
            category: typeName,
            description: post.ViewDescription || post.AllDescription || "ไม่มีรายละเอียด",
            imgSrc: getImageUrl(post, post.Poster),
            status,
            views: post.ViewCount ?? 0,
          };
        })
        .filter((item): item is ActivityData => item !== null);

      setActivities(mappedActivities);
    } catch (err) {
      console.error("❌ โหลดข้อมูล favorites ไม่สำเร็จ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    loadFavorites();

    const updateListener = () => loadFavorites();
    window.addEventListener("favoritesUpdated", updateListener);
    
    return () => {
      window.removeEventListener("favoritesUpdated", updateListener);
    };
  }, [user]);

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#F8F8F8]">
        <p className="text-gray-600 mb-4">กรุณาเข้าสู่ระบบเพื่อดูรายการโปรด</p>
        <button
          onClick={openLogin}
          className="px-6 py-2 bg-[#E35205] text-white rounded-lg hover:bg-[#d34700] transition"
        >
          เข้าสู่ระบบ
        </button>
      </main>
    );
  }

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