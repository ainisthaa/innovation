"use client";

import Link from "next/link";

export default function VolunteerPage() {
  const steps = [
    {
      title: "1. การส่งข้อมูลกิจกรรม",
      details: [
        "ส่งคำขอจัดกิจกรรมพร้อมรายละเอียดผ่าน Google Form",
        "เมื่อบันทึกข้อมูลครบถ้วนแล้ว เจ้าหน้าที่จะทำการตรวจสอบเบื้องต้น",
      ],
    },
    {
      title: "2. การตรวจสอบและอนุมัติข้อมูล",
      details: [
        "เมื่อข้อมูลได้รับการตรวจสอบ เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยันและสอบถามเพิ่มเติมหากจำเป็น",
        "หลังจากตรวจสอบเสร็จสิ้น เจ้าหน้าที่จะอัปเดตผลการอนุมัติให้ผู้จัดทราบทางระบบ",
      ],
    },
    {
      title: "3. การชำระค่าธรรมเนียม",
      details: [
        "เมื่อผ่านการอนุมัติแล้ว ผู้จัดจะได้รับเอกสารยืนยัน พร้อมรายละเอียดการชำระค่าธรรมเนียม",
        "สามารถชำระค่าธรรมเนียมได้ตามช่องทางที่กำหนด และอัปโหลดหลักฐานการชำระเงินในระบบ",
      ],
    },
    {
      title: "4. ข้อแนะนำสำหรับผู้จัดทำกิจกรรม",
      details: [
        "กรุณาตรวจสอบข้อมูลกิจกรรมให้ถูกต้องครบถ้วนก่อนส่ง",
        "หากมีการเปลี่ยนแปลงใด ๆ หลังจากยื่นข้อมูล ต้องแจ้งเจ้าหน้าที่ทันที",
        "ระบบ R-SA ถือเป็นการยืนยันว่าผู้จัดกิจกรรมยอมรับข้อตกลงทั้งหมดของระบบ",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8F8F8] flex flex-col items-center">
      {/* 🔸 ส่วนหัว */}
      <h3 className="text-3xl font-bold text-center text-black mt-[50px] mb-8">
        การประกาศลงค่าย
      </h3>

      {/* 🔹 กล่อง 4 กล่องตามขนาด 994px */}
      <div className="flex flex-col gap-[36px] w-[994px]">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white rounded-[15px] shadow-md p-6 leading-relaxed"
          >
            <h2 className="font-bold text-lg mb-3">{step.title}</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              {step.details.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 🔸 ปุ่ม “กรอกฟอร์มส่งรายละเอียดกิจกรรม” */}
      <div className="mt-[36px] mb-24">
        <Link
          href="https://forms.gle/" // 👉 ใส่ลิงก์ฟอร์มจริง
          target="_blank"
          className="block w-[994px] h-[88px] bg-[#E35205] text-white text-[20px] font-semibold 
                     flex items-center justify-center rounded-[20px]
                     shadow-[4px_4px_4px_rgba(0,0,0,0.25)] 
                     hover:bg-[#d34700] transition-all duration-200"
        >
          กรอกฟอร์มส่งรายละเอียดกิจกรรม
        </Link>
      </div>
    </main>
  );
}
