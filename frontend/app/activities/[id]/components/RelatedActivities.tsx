"use client";

import { useEffect, useState } from "react";
import { ActivityCard } from "@/app/components/home/ActivityCard";

interface RelatedActivitiesProps {
  activities: {
    id: number;
    title: string;
    category: string;
    description: string;
    imgSrc: string;
    status?: "upcoming" | "open" | "closed";
    views: number;
  }[];
}

export function RelatedActivities({ activities }: RelatedActivitiesProps) {
  const [favorites, setFavorites] = useState<number[]>([]);

  const loadFavorites = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(stored);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadFavorites();
    window.addEventListener("favoritesUpdated", loadFavorites);
    window.addEventListener("storage", loadFavorites);
    return () => {
      window.removeEventListener("favoritesUpdated", loadFavorites);
      window.removeEventListener("storage", loadFavorites);
    };
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 pb-20">
      <h2 className="text-2xl font-bold mb-8 text-center text-black/50">
        กิจกรรมอื่นๆ
      </h2>

      <div className="flex flex-col gap-6">
        {activities.map((a) => (
          <ActivityCard
            key={a.id}
            id={a.id}
            title={a.title}
            category={a.category}
            description={a.description}
            imgSrc={a.imgSrc}
            status={a.status}
            views={a.views}
          />
        ))}
      </div>
    </section>
  );
}
