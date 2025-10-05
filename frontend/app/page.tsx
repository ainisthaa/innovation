"use client";

import { ActivityCard } from "./components/home/ActivityCard";
import SearchSection from "./components/home/SearchSection";

export default function HomePage() {
  // mock data กิจกรรม (ไว้ทดสอบก่อนเชื่อม backend)
  const activities = [
    {
      title: "Com-Sci Camp 17",
      category: "ค่ายคอมพิวเตอร์",
      description:
        "ค่ายเรียนรู้พื้นฐานการเขียนโปรแกรมและกิจกรรมสนุก ๆ จากคณะวิทยาศาสตร์ พระจอมเกล้าลาดกระบัง",
      imgSrc: "/images/activity.png",
      isOpen: true,
      views: 134,
    },
    {
      title: "Workshop: AI for Beginners",
      category: "อบรมเชิงปฏิบัติการ",
      description:
        "เรียนรู้พื้นฐาน AI และ Machine Learning สำหรับผู้เริ่มต้น พร้อมตัวอย่างโค้ดจริงจากผู้เชี่ยวชาญ",
      imgSrc: "/images/activity.png",
      isOpen: false,
      views: 85,
    },
    {
      title: "Volunteer Day 2025",
      category: "กิจกรรมจิตอาสา",
      description:
        "รวมพลังนักศึกษา KMITL เพื่อช่วยเหลือชุมชน ปลูกต้นไม้ ทำความสะอาด และแบ่งปันความรู้ให้เยาวชน",
      imgSrc: "/images/activity.png",
      isOpen: true,
      views: 212,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8F8F8] pb-20">
      {/* 🔶 ส่วนค้นหา — ห่างจาก Navbar 55px */}
      <div className="flex justify-center mt-[55px]">
        <SearchSection />
      </div>

      {/* 🔸 หัวข้อรายการกิจกรรม */}
      <section className="max-w-6xl mx-auto mt-16 px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-black">
          รายการกิจกรรม
        </h2>

        {/* 🔸 แสดงการ์ดกิจกรรมทั้งหมด */}
        <div className="flex flex-col gap-6">
          {activities.map((activity, index) => (
            <ActivityCard key={index} {...activity} />
          ))}
        </div>

        {/* 🔸 ปุ่ม pagination (จำลอง) */}
        <div className="flex justify-center items-center mt-10 gap-2">
          {[1, 2, 3, "...", 10].map((num, i) => (
            <button
              key={i}
              className={`w-8 h-8 rounded-full text-sm font-semibold ${
                num === 1
                  ? "bg-[#FF9236] text-white"
                  : "bg-white border text-gray-700 hover:bg-gray-100"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
