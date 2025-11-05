"use client";

import { useState, useEffect } from "react";
import pb from "@/lib/pocketbase";
import { ActivityCard } from "./components/home/ActivityCard";
import { PaginationSection } from "./components/home/PaginationSection";
import SearchSection from "./components/home/SearchSection";

export default function HomePage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;

  // ✅ โหลดข้อมูลจริงจาก PocketBase
  useEffect(() => {
    const controller = new AbortController();

    async function fetchActivities() {
      try {
        const list = await pb.collection("Posts").getList(1, 50, {
          sort: "-created",
          signal: controller.signal,
        });

        setActivities(
          list.items.map((item: any) => ({
            id: item.id,
            title: item.Topic || "ไม่มีชื่อกิจกรรม",
            category: item.Type || "ไม่ระบุประเภท",
            description:
              item.ViewDescription ||
              item.AllDescription ||
              "ไม่มีรายละเอียดกิจกรรม",
            place: item.Place || "ไม่ระบุสถานที่",
            period: item.Period || "ไม่ระบุช่วงเวลา",
            requirement: item.Requirement || "ไม่ระบุคุณสมบัติ",
            organizer: item.Organized || "ไม่ระบุหน่วยงาน",
            contact: item.Contact || "ไม่ระบุช่องทางติดต่อ",
            views: item.ViewCount ?? 0,
            isOpen: item.Verify ?? false,
            openDate: item.OpenRegister || "ไม่ระบุวันที่เปิดรับสมัคร",
            closeDate: item.CloseRegister || "ไม่ระบุวันที่ปิดรับสมัคร",
            maxParticipants: item.MaxRegister || 0,
            imgSrc:
              item.Poster && item.Poster !== "N/A"
                ? `${pb.baseUrl}/api/files/${item.collectionId}/${item.id}/${item.Poster}`
                : "/images/activity.png",
          }))
        );
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("❌ โหลดข้อมูลกิจกรรมไม่สำเร็จ:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
    return () => controller.abort();
  }, []);

  // ✅ โหลด favorite จาก localStorage
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // ✅ บันทึก favorite เมื่อเปลี่ยน
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // ✅ toggle favorite
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // ✅ pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentActivities = activities.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(activities.length / itemsPerPage);

  // ✅ loading state
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600">
        กำลังโหลดกิจกรรม...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F8F8] pb-20">
      {/* 🔍 แถบค้นหา */}
      <div className="flex justify-center mt-[55px]">
        <SearchSection />
      </div>

      {/* 🔸 รายการกิจกรรม */}
      <section className="max-w-6xl mx-auto mt-16 px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-black">
          รายการกิจกรรม
        </h2>

        {activities.length === 0 ? (
          <p className="text-center text-gray-500">ยังไม่มีกิจกรรมในระบบ</p>
        ) : (
          <div className="flex flex-col gap-6">
            {currentActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                id={activity.id}
                title={activity.title}
                category={activity.category}
                description={activity.description}
                imgSrc={activity.imgSrc}
                status={activity.isOpen ? "open" : "closed"}
                views={activity.views}
                isFavorite={favorites.includes(activity.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}

        {/* 🔸 pagination */}
        {activities.length > itemsPerPage && (
          <div className="mt-10">
            <PaginationSection
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </section>
    </main>
  );
}
