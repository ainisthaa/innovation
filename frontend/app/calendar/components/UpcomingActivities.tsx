"use client";

import { ActivityCard } from "@/app/components/home/ActivityCard";





export function UpcomingActivities() {
  const activities = Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    title: "ชื่อกิจกรรม",
    category: "ประเภทกิจกรรม",
    description: "รายละเอียดกิจกรรมจจจจจจจจจจจจจจจจจจจจจจจจจจจจจจจจจจ",
    imgSrc: "/images/activity.png",
    status: "upcoming", // ✅ ใช้สถานะใหม่
    views: 100,
  }));

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
