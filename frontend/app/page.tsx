"use client";

import { useState, useEffect } from "react";
import { ActivityCard } from "./components/home/ActivityCard";
import { PaginationSection } from "./components/home/PaginationSection";
import SearchSection from "./components/home/SearchSection";

export default function HomePage() {
  // mock data 30 กิจกรรม
  const mockActivities = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `กิจกรรมที่ ${i + 1}`,
    category: i % 2 === 0 ? "ค่ายคอมพิวเตอร์" : "กิจกรรมจิตอาสา",
    description:
      "รายละเอียดกิจกรรม Lorem ipsum dolor sit amet consectetur adipiscing elit.",
    imgSrc: "/images/activity.png",
    isOpen: i % 2 === 0,
    views: Math.floor(Math.random() * 300) + 50,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);
  const itemsPerPage = 10;

  // โหลด favorite จาก localStorage
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // บันทึก favorite
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // toggle favorite
  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentActivities = mockActivities.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(mockActivities.length / itemsPerPage);

  return (
    <main className="min-h-screen bg-[#F8F8F8] pb-20">
      <div className="flex justify-center mt-[55px]">
        <SearchSection />
      </div>

      <section className="max-w-6xl mx-auto mt-16 px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-black">
          รายการกิจกรรม
        </h2>

        <div className="flex flex-col gap-6">
          {currentActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              {...activity}
              isFavorite={favorites.includes(activity.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>

        <div className="mt-10">
          <PaginationSection
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </main>
  );
}
