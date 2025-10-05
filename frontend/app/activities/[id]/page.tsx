"use client";

import { useParams } from "next/navigation";
import { ActivityDetail } from "./components/ActivityDetail";
import { RelatedActivities } from "./components/RelatedActivities";

export default function ActivityDetailPage() {
  const { id } = useParams(); // รับค่า id จาก URL เช่น /activities/1

  // 🔸 mock กิจกรรมหลัก
  const mockActivity = {
    title: `CS CAMP ${id}`,
    category: "ค่ายคอมพิวเตอร์",
    description:
      "นี่คือรายละเอียดกิจกรรมแบบ mock เพื่อใช้ทดสอบระบบแสดงผลก่อนเชื่อม backend จริง",
    organizer: "คณะวิทยาศาสตร์",
    contact: "science@kmitl.ac.th",
    startDate: "15 ตุลาคม 2568 เวลา 08:00 น.",
    endDate: "15 ตุลาคม 2568 เวลา 23:59 น.",
    maxParticipants: 100,
    isOpen: true,
    imgSrc: "/images/activity.png",
  };

  // 🔸 mock กิจกรรมอื่น ๆ (ต้องมี id)
  const related = [
    {
      id: 1,
      title: "Com-Sci Camp 17",
      category: "ค่าย",
      description: "ค่ายเรียนรู้พื้นฐานการเขียนโปรแกรม",
      imgSrc: "/images/activity.png",
      isOpen: true,
      views: 100,
    },
    {
      id: 2,
      title: "AI Workshop",
      category: "อบรม",
      description: "เรียนรู้พื้นฐาน Machine Learning สำหรับผู้เริ่มต้น",
      imgSrc: "/images/activity.png",
      isOpen: false,
      views: 80,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8F8F8]">
      <ActivityDetail activity={mockActivity} />
      <RelatedActivities activities={related} />
    </main>
  );
}
