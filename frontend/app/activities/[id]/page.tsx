// app/activities/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import pb from "@/lib/pocketbase";

import { RelatedActivities } from "./components/RelatedActivities";
import { ActivityDetail } from "./components/ActivityDetail";

export default function ActivityDetailPage() {
  const { id } = useParams();
  const [activity, setActivity] = useState<any | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // ✅ ดึงกิจกรรมหลักจาก PocketBase ด้วย id จริง
        const record = await pb.collection("Posts").getOne(id as string);

        setActivity({
          id: record.id,
          title: record.Topic || "ไม่มีชื่อกิจกรรม",
          category: record.Type || "ไม่ระบุประเภท",
          description:
            record.AllDescription ||
            record.ViewDescription ||
            "ไม่มีรายละเอียดกิจกรรม",
          shortDescription: record.ViewDescription || "",
          organizer: record.Organized || "ไม่ระบุหน่วยงาน",
          contact: record.Contact || "ไม่ระบุช่องทางติดต่อ",
          place: record.Place || "ไม่ระบุสถานที่",
          period: record.Period || "-",
          requirement: record.Requirement || "-",
          startDate: record.OpenRegister || "-",
          endDate: record.CloseRegister || "-",
          maxParticipants: record.MaxRegister || 0,
          views: record.ViewCount ?? 0,
          isOpen: record.Verify ?? false, // ✅ ใช้ Verify อย่างเดียว
          imgSrc:
            record.Poster && record.Poster !== "N/A"
              ? `${pb.baseUrl}/api/files/${record.collectionId}/${record.id}/${record.Poster}`
              : "/images/activity.png",
          registerLink: record.RegisterLink || "",
        });

        // ✅ ดึงกิจกรรมอื่น (ยกเว้น id ปัจจุบัน) และกรองเฉพาะที่ Verify = true
        const list = await pb.collection("Posts").getList(1, 10, {
          filter: `id != "${id}" && Verify = true`, // ✅ กรองเฉพาะที่ Verify = true
          sort: "-created",
        });

        console.log("🔍 [ActivityDetailPage] Related posts from DB:", list.items);
        console.log("🔍 [ActivityDetailPage] Number of related posts:", list.items.length);

        const relatedActivities = list.items.map((item: any) => {
          // ✅ คำนวณ status จาก Verify
          const status: "upcoming" | "open" | "closed" = item.Verify ? "open" : "closed";
          
          console.log(`🔍 Mapping item ${item.id} - Verify: ${item.Verify}, Status: ${status}`);
          
          return {
            id: item.id,
            title: item.Topic || "ไม่มีชื่อกิจกรรม",
            category: item.Type || "ไม่ระบุประเภท",
            description: item.ViewDescription || "ไม่มีรายละเอียด",
            imgSrc:
              item.Poster && item.Poster !== "N/A"
                ? `${pb.baseUrl}/api/files/${item.collectionId}/${item.id}/${item.Poster}`
                : "/images/activity.png",
            status: status, // ✅ ส่ง status ที่คำนวณแล้ว
            views: item.ViewCount ?? 0,
          };
        });

        console.log("🔍 [ActivityDetailPage] Related activities after mapping:", relatedActivities);
        
        setRelated(relatedActivities);
      } catch (err) {
        console.error("❌ โหลดข้อมูลกิจกรรมไม่สำเร็จ:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600">
        กำลังโหลดข้อมูลกิจกรรม...
      </main>
    );
  }

  if (!activity) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-500">
        ไม่พบข้อมูลกิจกรรมนี้
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F8F8]">
      <ActivityDetail activity={activity} />
      <RelatedActivities activities={related} />
    </main>
  );
}