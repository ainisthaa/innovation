"use client";

import Image from "next/image";
import { Pencil, Heart } from "lucide-react";

interface ActivityDetailProps {
  activity: {
    title: string;
    category: string;
    description: string;
    organizer: string;
    contact: string;
    startDate: string;
    endDate: string;
    maxParticipants: number;
    isOpen: boolean;
    imgSrc: string;
  };
}

export function ActivityDetail({ activity }: ActivityDetailProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      {/* 🔸 รูปกิจกรรม */}
      <Image
        src={activity.imgSrc}
        alt={activity.title}
        width={1000}
        height={400}
        className="rounded-lg shadow-md w-full object-cover"
      />

      {/* 🔸 ป้ายสถานะ */}
      <div className="flex justify-center mt-4">
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-md ${
            activity.isOpen ? "bg-green-500 text-black" : "bg-red-500 text-black"
          }`}
        >
          {activity.isOpen ? "เปิดรับสมัครแล้ว" : "ปิดรับสมัครแล้ว"}
        </span>
      </div>

      {/* 🔸 ข้อมูลกิจกรรม */}
      <h1 className="text-center text-xl font-bold mt-3">{activity.title}</h1>

      <div className="mt-6 space-y-4">
        <p>
          <strong>ประเภทกิจกรรม:</strong> {activity.category}
        </p>
        <p>
          <strong>สถานที่จัดกิจกรรม:</strong> {activity.organizer}
        </p>
        <p>
          <strong>ช่วงเวลากิจกรรม:</strong> {activity.startDate}
        </p>
        <p>
          <strong>คุณสมบัติ:</strong> Lorem ipsum
        </p>
      </div>

      {/* 🔸 กล่องวันเวลา / จำนวนรับ */}
      <div className="flex justify-left gap-6 mt-8 flex-wrap">
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
        <h2 className="font-bold mb-2">รายละเอียดกิจกรรม</h2>
        <p className="text-justify leading-relaxed text-gray-800">
          {activity.description.repeat(2)}
        </p>
      </div>

      {/* 🔸 ผู้จัดและช่องทางติดต่อ */}
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
          className="w-[335px] h-[130px] bg-[#F7F7F7] border border-black/25 rounded-[20px] 
                     flex flex-col items-center justify-center hover:shadow-md transition-all"
        >
          <span className="font-bold text-xl text-black mb-2">ลงทะเบียน</span>
          <Pencil size={38} strokeWidth={2.3} className="text-black" />
        </button>

        {/* ปุ่มรายการโปรด */}
        <button
          className="w-[335px] h-[130px] bg-[#F7F7F7] border border-black/25 rounded-[20px]
                     flex flex-col items-center justify-center hover:shadow-md transition-all"
        >
          <span className="font-bold text-xl text-black mb-2">
            เพิ่มลงรายการโปรด
          </span>
          <Heart size={42} strokeWidth={2.5} className="text-[#FF9236]" />
        </button>
      </div>

      {/* 🔸 เส้นคั่น */}
      <hr className="my-10 border-t border-gray-300" />
    </section>
  );
}
