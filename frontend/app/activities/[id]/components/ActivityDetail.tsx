"use client";

import Image from "next/image";
import { Pencil, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

interface ActivityDetailProps {
  activity: {
    id?: string;
    title: string;
    category: string;
    description: string;
    shortDescription?: string;
    organizer: string;
    contact: string;
    place: string;
    period: string;
    requirement: string;
    startDate: string;
    endDate: string;
    maxParticipants: number;
    isOpen: boolean;
    imgSrc: string;
  };
}

export function ActivityDetail({ activity }: ActivityDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { user, openLogin } = useAuth();

  // ✅ โหลดสถานะ favorite จาก localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (activity.id && stored.includes(activity.id)) {
      setIsFavorite(true);
    }
  }, [activity.id]);

  // ✅ toggle favorite
  const toggleFavorite = () => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");

    const updated = isFavorite
      ? stored.filter((id: string) => id !== activity.id)
      : [...stored, activity.id];

    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-10 text-gray-800">
      {/* 🔸 ภาพหลัก */}
      <Image
        src={activity.imgSrc}
        alt={activity.title}
        width={1000}
        height={400}
        className="rounded-lg shadow-md w-full object-cover"
      />

      {/* 🔸 สถานะกิจกรรม */}
      <div className="flex justify-center mt-5">
        <span
          className={`text-sm font-semibold px-4 py-1 rounded-md ${
            activity.isOpen ? "bg-green-400 text-black" : "bg-red-400 text-black"
          }`}
        >
          {activity.isOpen ? "เปิดรับสมัครแล้ว" : "ปิดรับสมัครแล้ว"}
        </span>
      </div>

      {/* 🔸 ชื่อกิจกรรม */}
      <h1 className="text-center text-2xl font-bold mt-5">{activity.title}</h1>

      {/* 🔸 รายละเอียดสั้น */}
      {activity.shortDescription && (
        <p className="text-center text-gray-600 mt-2">
          {activity.shortDescription}
        </p>
      )}

      {/* 🔸 ข้อมูลสรุปกิจกรรม */}
      <div className="mt-8 space-y-3 text-[16px]">
        <p>
          <strong>ประเภทกิจกรรม:</strong> {activity.category}
        </p>
        <p>
          <strong>สถานที่จัดกิจกรรม:</strong> {activity.place}
        </p>
        <p>
          <strong>ช่วงเวลากิจกรรม:</strong> {activity.period}
        </p>
        <p>
          <strong>คุณสมบัติผู้เข้าร่วม:</strong> {activity.requirement}
        </p>
      </div>

      {/* 🔸 กล่องข้อมูลสมัคร */}
      <div className="flex flex-wrap justify-left gap-6 mt-10">
        <div className="bg-[#FF9236] text-black rounded-[10px] px-6 py-3 text-center w-[230px]">
          <p className="font-semibold">เปิดรับสมัคร</p>
          <p className="text-sm">{activity.startDate}</p>
        </div>

        <div className="bg-[#FF9236] text-black rounded-[10px] px-6 py-3 text-center w-[230px]">
          <p className="font-semibold">ปิดรับสมัคร</p>
          <p className="text-sm">{activity.endDate}</p>
        </div>

        <div className="bg-[#FF9236] text-black rounded-[10px] px-6 py-3 text-center w-[230px]">
          <p className="font-semibold">จำนวนที่รับ</p>
          <p className="text-sm">{activity.maxParticipants}</p>
        </div>
      </div>

      {/* 🔸 รายละเอียดกิจกรรม */}
      <div className="mt-10">
        <h2 className="font-bold mb-2 text-lg">รายละเอียดกิจกรรม</h2>
        <p className="text-justify leading-relaxed text-gray-800 whitespace-pre-line">
          {activity.description}
        </p>
      </div>

      {/* 🔸 ข้อมูลติดต่อและหน่วยงาน */}
      <div className="mt-8 space-y-6">
        <div>
          <h3 className="font-bold text-lg">จัดกิจกรรมโดย</h3>
          <p>{activity.organizer}</p>
        </div>
        <div>
          <h3 className="font-bold text-lg">ช่องทางการติดต่อ</h3>
          <p>{activity.contact}</p>
        </div>
      </div>

      {/* 🔸 ปุ่ม */}
      <div className="flex justify-center gap-10 mt-10 flex-wrap">
        {/* ปุ่มลงทะเบียน */}
        <button
          onClick={() => {
            if (!user) return openLogin();
            alert("✅ ไปหน้าลงทะเบียนได้เลย (ต่อเชื่อมภายหลัง)");
          }}
          className="w-[335px] h-[130px] bg-[#F7F7F7] border border-black/25 rounded-[20px] 
                     flex flex-col items-center justify-center hover:shadow-md transition-all"
        >
          <span className="font-bold text-xl text-black mb-2">ลงทะเบียน</span>
          <Pencil size={38} strokeWidth={2.3} className="text-black" />
        </button>

        {/* ปุ่มรายการโปรด */}
        <motion.button
          onClick={toggleFavorite}
          whileTap={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-[335px] h-[130px] bg-[#F7F7F7] border border-black/25 rounded-[20px]
                     flex flex-col items-center justify-center hover:shadow-md transition-all"
        >
          <span className="font-bold text-xl text-black mb-2">
            {isFavorite ? "ลบออกจากรายการโปรด" : "เพิ่มลงรายการโปรด"}
          </span>
          <Heart
            size={42}
            strokeWidth={2.5}
            className={`transition-all duration-300 ${
              isFavorite ? "fill-[#FF9236] text-[#FF9236]" : "text-[#FF9236]"
            }`}
          />
        </motion.button>
      </div>

      <hr className="my-10 border-t border-gray-300" />
    </section>
  );
}
