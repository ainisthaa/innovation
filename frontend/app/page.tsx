// app/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import pb, { Post, getImageUrl } from "@/lib/pocketbase";
import { ActivityCard } from "./components/home/ActivityCard";
import { PaginationSection } from "./components/home/PaginationSection";
import SearchSection from "./components/home/SearchSection";

interface ActivityData {
  id: string;
  title: string;
  category: string;
  description: string;
  imgSrc: string;
  status: "upcoming" | "open" | "closed";
  views: number;
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const [activities, setActivities] = useState<ActivityData[]>([]);
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
        
        // ✅ Search in Topic, ViewDescription, AllDescription
        if (q) {
          filters.push(`(Topic ~ "${q}" || ViewDescription ~ "${q}" || AllDescription ~ "${q}")`);
        }
        
        // Note: Faculty/Department ยังไม่มีใน Backend
        // เมื่อเพิ่มใน PocketBase แล้ว uncomment บรรทัดด้านล่าง
        // if (faculty) filters.push(`Faculty = "${faculty}"`);
        // if (department) filters.push(`Department = "${department}"`);
        
        if (type) filters.push(`Type = "${type}"`);

        const filterString = filters.length > 0 ? filters.join(" && ") : "";

        // ✅ Type-safe query
        const list = await pb.collection("Posts").getList<Post>(1, 100, {
          sort: "-created",
          filter: filterString,
          requestKey: `posts_${Date.now()}`,
        });

        // ✅ Map to ActivityData - ใช้ Verify อย่างเดียว (ไม่สนใจวันที่)
        const mappedActivities: ActivityData[] = list.items.map((item) => {
          // Verify = true → open, Verify = false → closed
          const status: "upcoming" | "open" | "closed" = item.Verify ? "open" : "closed";
          
          return {
            id: item.id,
            title: item.Topic || "ไม่มีชื่อกิจกรรม",
            category: item.Type || "ไม่ระบุประเภท",
            description: item.ViewDescription || item.AllDescription || "ไม่มีรายละเอียดกิจกรรม",
            imgSrc: getImageUrl(item, item.Poster),
            status: status,
            views: item.ViewCount ?? 0,
          };
        });

        // ✅ เรียงให้กิจกรรมที่เปิดรับสมัครอยู่ขึ้นด้านบนสุด
        const sortedActivities = mappedActivities.sort((a, b) => {
          if (a.status === "open" && b.status !== "open") return -1;
          if (a.status !== "open" && b.status === "open") return 1;
          return 0;
        });

        setActivities(sortedActivities);
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
                status={activity.status}
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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        กำลังโหลด...
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}