"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import pb from "@/lib/pocketbase";
import { ActivityDetail } from "./components/ActivityDetail";
import { RelatedActivities } from "./components/RelatedActivities";

export default function ActivityDetailPage() {
  const { id } = useParams(); // รับ id จาก URL เช่น /activities/7fi8yhh90rl29d3
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
          isOpen: record.Verify ?? false,
          imgSrc:
            record.Poster && record.Poster !== "N/A"
              ? `${pb.baseUrl}/api/files/${record.collectionId}/${record.id}/${record.Poster}`
              : "/images/activity.png",
        });

        // ✅ ดึงกิจกรรมอื่น (ยกเว้น id ปัจจุบัน)
        const list = await pb.collection("Posts").getList(1, 4, {
          filter: `id != "${id}"`,
          sort: "-created",
        });

        setRelated(
          list.items.map((item: any) => ({
            id: item.id,
            title: item.Topic || "ไม่มีชื่อกิจกรรม",
            category: item.Type || "ไม่ระบุประเภท",
            description: item.ViewDescription || "ไม่มีรายละเอียด",
            imgSrc:
              item.Poster && item.Poster !== "N/A"
                ? `${pb.baseUrl}/api/files/${item.collectionId}/${item.id}/${item.Poster}`
                : "/images/activity.png",
            status: item.Verify ? "open" : "closed",
            views: item.ViewCount ?? 0,
          }))
        );
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
