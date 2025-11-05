"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import pb from "@/lib/pocketbase";
import { ActivityCard } from "./components/home/ActivityCard";
import { PaginationSection } from "./components/home/PaginationSection";
import SearchSection from "./components/home/SearchSection";

function HomePageContent() {
  const searchParams = useSearchParams();
  const [activities, setActivities] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;

  useEffect(() => {
    const controller = new AbortController();

    async function fetchActivities() {
      try {
        setLoading(true);
        
        const q = searchParams.get("q") || "";
        const faculty = searchParams.get("faculty") || "";
        const department = searchParams.get("department") || "";
        const type = searchParams.get("type") || "";

        let filters = [];
        if (q) filters.push(`(Topic ~ "${q}" || ViewDescription ~ "${q}" || AllDescription ~ "${q}")`);
        if (faculty) filters.push(`Faculty = "${faculty}"`);
        if (department) filters.push(`Department = "${department}"`);
        if (type) filters.push(`Type = "${type}"`);

        const filterString = filters.length > 0 ? filters.join(" && ") : "";

        const list = await pb.collection("Posts").getList(1, 100, {
          sort: "-created",
          filter: filterString,
          signal: controller.signal,
        });

        setActivities(
          list.items.map((item: any) => ({
            id: item.id,
            title: item.Topic || "ไม่มีชื่อกิจกรรม",
            category: item.Type || "ไม่ระบุประเภท",
            description: item.ViewDescription || item.AllDescription || "ไม่มีรายละเอียดกิจกรรม",
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
        
        setCurrentPage(1);
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
  }, [searchParams]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentActivities = activities.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(activities.length / itemsPerPage);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600">
        กำลังโหลดกิจกรรม...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F8F8] pb-20">
      <div className="flex justify-center mt-[55px]">
        <SearchSection />
      </div>

      <section className="max-w-6xl mx-auto mt-16 px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-black">
          รายการกิจกรรม
        </h2>

        {activities.length === 0 ? (
          <p className="text-center text-gray-500">ไม่พบกิจกรรมที่ค้นหา</p>
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
              />
            ))}
          </div>
        )}

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

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">กำลังโหลด...</div>}>
      <HomePageContent />
    </Suspense>
  );
}

