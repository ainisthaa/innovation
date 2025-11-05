"use client";

import { ActivityCard } from "@/app/components/home/ActivityCard";
import { useEffect, useState } from "react";
import pb from "@/lib/pocketbase";

export function UpcomingActivities() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpcoming() {
      try {
        const today = new Date().toISOString().split("T")[0];
        const list = await pb.collection("Posts").getList(1, 8, {
          sort: "OpenRegister",
          filter: `Verify = true && OpenRegister >= "${today}"`,
        });

        setActivities(
          list.items.map((item: any) => ({
            id: item.id,
            title: item.Topic || "ไม่มีชื่อกิจกรรม",
            category: item.Type || "ไม่ระบุประเภท",
            description: item.ViewDescription || item.AllDescription || "ไม่มีรายละเอียด",
            imgSrc:
              item.Poster && item.Poster !== "N/A"
                ? `${pb.baseUrl}/api/files/${item.collectionId}/${item.id}/${item.Poster}`
                : "/images/activity.png",
            status: "upcoming" as const,
            views: item.ViewCount ?? 0,
          }))
        );
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

