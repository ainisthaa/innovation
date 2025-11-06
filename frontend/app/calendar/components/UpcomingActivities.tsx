// app/calendar/components/UpcomingActivities.tsx
"use client";

import { ActivityCard } from "@/app/components/home/ActivityCard";
import { useEffect, useState } from "react";
import pb, { Post } from "@/lib/pocketbase";

interface ActivityData {
  id: string;
  title: string;
  category: string;
  description: string;
  imgSrc: string;
  status: "upcoming" | "open" | "closed";
  views: number;
}

export function UpcomingActivities() {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpcoming() {
      try {
        const today = new Date().toISOString().split("T")[0];
        
        // ✅ ดึงกิจกรรมที่กำลังจะมาถึง (OpenRegister >= วันนี้)
        const list = await pb.collection("Posts").getList<Post>(1, 8, {
          sort: "OpenRegister",
          filter: `Verify = true && OpenRegister >= "${today}"`,
          requestKey: `upcoming_${Date.now()}`,
        });

        const mappedActivities: ActivityData[] = list.items.map((item) => {
          let status: "upcoming" | "open" | "closed" = "upcoming";
          
          const now = new Date();
          const openDate = item.OpenRegister ? new Date(item.OpenRegister) : null;
          const closeDate = item.CloseRegister ? new Date(item.CloseRegister) : null;
          
          if (openDate && closeDate) {
            if (now >= openDate && now <= closeDate) {
              status = "open";
            } else if (now > closeDate) {
              status = "closed";
            }
          }

          return {
            id: item.id,
            title: item.Topic || "ไม่มีชื่อกิจกรรม",
            category: item.Type || "ไม่ระบุประเภท",
            description: item.ViewDescription || item.AllDescription || "ไม่มีรายละเอียด",
            imgSrc:
              item.Poster && item.Poster !== "N/A"
                ? `${pb.baseUrl}/api/files/${item.collectionId}/${item.id}/${item.Poster}`
                : "/images/activity.png",
            status,
            views: item.ViewCount ?? 0,
          };
        });

        setActivities(mappedActivities);
      } catch (err) {
        console.error("❌ โหลดกิจกรรมที่กำลังจะมาถึงไม่สำเร็จ:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUpcoming();
  }, []);

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto mt-16 px-4 pb-20">
        <h2 className="text-2xl font-bold text-center mb-8 text-black/50">
          กิจกรรมที่จะเกิดขึ้นเร็ว ๆ นี้
        </h2>
        <p className="text-center text-gray-600">กำลังโหลดข้อมูล...</p>
      </section>
    );
  }

  if (activities.length === 0) {
    return (
      <section className="max-w-6xl mx-auto mt-16 px-4 pb-20">
        <h2 className="text-2xl font-bold text-center mb-8 text-black/50">
          กิจกรรมที่จะเกิดขึ้นเร็ว ๆ นี้
        </h2>
        <p className="text-center text-gray-500">ยังไม่มีกิจกรรมที่กำลังจะมาถึง</p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto mt-16 px-4 pb-20">
      <h2 className="text-2xl font-bold text-center mb-8 text-black/50">
        กิจกรรมที่จะเกิดขึ้นเร็ว ๆ นี้
      </h2>

      <div className="flex flex-col gap-6">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} {...activity} />
        ))}
      </div>
    </section>
  );
}