// app/activities/[id]/components/RelatedActivities.tsx
"use client";

import { useEffect, useState } from "react";
import { ActivityCard } from "@/app/components/home/ActivityCard";
import pb from "@/lib/pocketbase";
import { useAuth } from "@/app/context/AuthContext";

interface RelatedActivitiesProps {
  activities: {
    id: string;
    title: string;
    category: string;
    description: string;
    imgSrc: string;
    status?: "upcoming" | "open" | "closed";
    views: number;
  }[];
}

export function RelatedActivities({ activities }: RelatedActivitiesProps) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ กรองเฉพาะกิจกรรมที่ status = "open"
  const openActivities = activities.filter((a) => a.status === "open");

  // Load favorites from PocketBase
  const loadFavorites = async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return;

      const list = await pb.collection("Favorites").getList(1, 100, {
        filter: `UserID="${userId}"`,
        fields: "PostID",
        requestKey: null,
      });

      setFavorites(list.items.map((item: any) => item.PostID));
    } catch (err) {
      console.error("Error loading favorites:", err);
    }
  };

  useEffect(() => {
    loadFavorites();

    // Listen for updates
    const handleUpdate = () => loadFavorites();
    window.addEventListener("favoritesUpdated", handleUpdate);

    return () => {
      window.removeEventListener("favoritesUpdated", handleUpdate);
    };
  }, [user]);

  // Toggle favorite
  const toggleFavorite = async (activityId: string) => {
    if (!user) return;
    
    const userId = pb.authStore.model?.id;
    if (!userId) return;

    setLoading(true);
    try {
      const existing = await pb.collection("Favorites").getList(1, 1, {
        filter: `UserID="${userId}" && PostID="${activityId}"`,
        requestKey: null,
      });

      if (existing.items.length > 0) {
        // Remove from favorites
        await pb.collection("Favorites").delete(existing.items[0].id);
        setFavorites(favorites.filter((id) => id !== activityId));
      } else {
        // Add to favorites
        await pb.collection("Favorites").create({
          UserID: userId,
          PostID: activityId,
          Notify: false,
        });
        setFavorites([...favorites, activityId]);
      }

      window.dispatchEvent(new Event("favoritesUpdated"));
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ถ้าไม่มีกิจกรรมที่เป็น open เลย ก็ไม่แสดงอะไร
  if (!openActivities || openActivities.length === 0) {
    return null; // หรือจะแสดงข้อความว่า "ไม่มีกิจกรรมที่เปิดรับสมัครในขณะนี้" ก็ได้
  }

  return (
    <section className="max-w-6xl mx-auto px-4 pb-20">
      <h2 className="text-2xl font-bold mb-8 text-center text-black/60">
        กิจกรรมอื่นๆ
      </h2>

      <div className="flex flex-col gap-6">
        {openActivities.map((a) => (
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
    </section>
  );
}