// app/components/home/SearchSection.tsx
"use client";

import { ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import pb, { Post } from "@/lib/pocketbase";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get("q") || "");
  const [faculty, setFaculty] = useState(searchParams.get("faculty") || "");
  const [department, setDepartment] = useState(searchParams.get("department") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  
  // ✅ Hardcode รายการคณะไว้ก่อน (รอ backend เพิ่ม field Faculty)
  const [faculties] = useState<string[]>([
    "คณะวิศวกรรมศาสตร์",
    "คณะสถาปัตยกรรม ศิลปะและการออกแบบ",
    "คณะครุศาสตร์อุตสาหกรรมและเทคโนโลยี",
    "คณะเทคโนโลยีการเกษตร",
    "คณะวิทยาศาสตร์",
    "คณะอุตสาหกรรมอาหาร",
    "คณะเทคโนโลยีสารสนเทศ",
    "วิทยาลัยนานาชาติ",
    "วิทยาลัยเทคโนโลยีและนวัตกรรมวัสดุ",
    "วิทยาลัยนวัตกรรมการผลิตขั้นสูง",
    "คณะบริหารธุรกิจ",
    "วิทยาลัยอุตสาหกรรมการบินนานาชาติ",
    "คณะศิลปศาสตร์",
    "คณะแพทยศาสตร์",
    "คณะทันตแพทยศาสตร์",
    "สำนักวิชาศึกษาทั่วไป",
    "นักศึกษาแลกเปลี่ยน",
  ]);
  
  // ✅ Mock data: สาขาแยกตามคณะ
  const facultyDepartmentMap: { [key: string]: string[] } = {
    "คณะวิศวกรรมศาสตร์": [
      "วิศวกรรมโทรคมนาคม",
      "วิศวกรรมไฟฟ้า",
      "วิศวกรรมอิเล็กทรอนิกส์",
      "วิศวกรรมระบบควบคุม",
      "วิศวกรรมคอมพิวเตอร์",
      "วิศวกรรมเครื่องกล",
      "วิศวกรรมการจัดการและควบคุม",
    ],
    "คณะสถาปัตยกรรม ศิลปะและการออกแบบ": [
      "วิศวกรรมโยธา",
      "วิศวกรรมเกษตร",
      "วิศวกรรมเคมี",
      "วิศวกรรมอาหาร",
      "วิศวกรรมสารสนเทศ",
      "ยังไม่เลือกภาควิชา",
      "วิศวกรรมอุตสาหการ",
    ],
    "คณะครุศาสตร์อุตสาหกรรมและเทคโนโลยี": [
      "วิศวกรรมอัตโนมัติ",
      "วิศวกรรมบ่อกันประเทศ",
      "วิศวกรรมการบินและนักบินพาณิชย์",
      "วิศวกรรมซีวิการแพทย์",
      "สำนักงานบริหารหลักสูตรวิศวกรรมศาสตร์นานาชาติ",
      "วิศวกรรมพลังงาน",
    ],
    "คณะเทคโนโลยีการเกษตร": [
      "วิศวกรรมและการเป็นผู้ประกอบการ",
      "คณะวิศวกรรมศาสตร์ ไม่ประจำภาควิชา",
      "วิศวกรรมหุ่นยนต์และปัญญาประดิษฐ์",
      "วิศวกรรมระบบไอโอทีและสารสนเทศ",
    ],
    // เพิ่มคณะอื่นๆ ตามต้องการ...
  };
  
  const [departments, setDepartments] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  
  const [showFaculty, setShowFaculty] = useState(false);
  const [showDepartment, setShowDepartment] = useState(false);
  const [showType, setShowType] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFilters() {
      try {
        setLoading(true);
        
        // ✅ Type-safe query with Post interface
        const list = await pb.collection("Posts").getList<Post>(1, 500, {
          fields: "Type",
          requestKey: `filters_${Date.now()}`,
        });

        const typeSet = new Set<string>();

        // ✅ Type-safe iteration
        list.items.forEach((item) => {
          if (item.Type && item.Type !== "N/A") {
            typeSet.add(item.Type);
          }
        });

        setTypes(Array.from(typeSet).sort());
      } catch (err) {
        console.error("❌ โหลดตัวกรองไม่สำเร็จ:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFilters();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchText.trim()) params.set("q", searchText.trim());
    if (faculty) params.set("faculty", faculty);
    if (department) params.set("department", department);
    if (type) params.set("type", type);

    router.push(`/?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ✅ Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowFaculty(false);
      setShowDepartment(false);
      setShowType(false);
    };

    if (showFaculty || showDepartment || showType) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showFaculty, showDepartment, showType]);

  return (
    <div className="w-[1058px] h-[136px] bg-[#FF9236] rounded-[20px] mx-auto shadow-[5px_5px_4px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center justify-center gap-3">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="ชื่อกิจกรรม / คณะ / สาขา"
          className="w-[866px] h-[40px] bg-white rounded-full px-6 text-gray-700 placeholder:text-gray-500 border border-gray-300 shadow-sm focus:outline-none focus:border-[#FF9236]"
        />

        <button
          onClick={handleSearch}
          className="w-[102px] h-[40px] bg-white rounded-full shadow-sm border border-gray-300 font-medium text-black hover:bg-gray-100 transition"
        >
          ค้นหา
        </button>
      </div>

      <div className="flex justify-start gap-[16px] mt-[6px] ml-[-115px]" style={{ width: "866px" }}>
        {/* Dropdown คณะ */}
        <div className="relative" style={{ width: "278px", height: "32px" }}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowFaculty(!showFaculty);
              setShowDepartment(false);
              setShowType(false);
            }}
            className="bg-white rounded-full flex items-center justify-between px-6 text-gray-700 cursor-pointer border-none shadow-sm h-full"
          >
            <span className="text-gray-500 text-sm">{faculty || "คณะ"}</span>
            <ChevronDown className="text-black" size={16} />
          </div>
          {showFaculty && (
            <div 
              className="absolute top-[36px] left-0 w-full bg-white rounded-lg shadow-lg max-h-[200px] overflow-y-auto z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                onClick={() => {
                  setFaculty("");
                  setDepartment(""); // ✅ รีเซ็ตสาขาด้วย
                  setDepartments([]); // ✅ เคลียร์รายการสาขา
                  setShowFaculty(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                ทั้งหมด
              </div>
              {faculties.map((f) => (
                <div
                  key={f}
                  onClick={() => {
                    setFaculty(f);
                    setDepartment(""); // ✅ รีเซ็ตสาขาเมื่อเปลี่ยนคณะ
                    // ✅ อัปเดตรายการสาขาตามคณะที่เลือก
                    setDepartments(facultyDepartmentMap[f] || []);
                    setShowFaculty(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {f}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown สาขา */}
        <div className="relative" style={{ width: "278px", height: "32px" }}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowDepartment(!showDepartment);
              setShowFaculty(false);
              setShowType(false);
            }}
            className="bg-white rounded-full flex items-center justify-between px-6 text-gray-700 cursor-pointer border-none shadow-sm h-full"
          >
            <span className="text-gray-500 text-sm">{department || "สาขา"}</span>
            <ChevronDown className="text-black" size={16} />
          </div>
          {showDepartment && departments.length > 0 && (
            <div 
              className="absolute top-[36px] left-0 w-full bg-white rounded-lg shadow-lg max-h-[200px] overflow-y-auto z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                onClick={() => {
                  setDepartment("");
                  setShowDepartment(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                ทั้งหมด
              </div>
              {departments.map((d) => (
                <div
                  key={d}
                  onClick={() => {
                    setDepartment(d);
                    setShowDepartment(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {d}
                </div>
              ))}
            </div>
          )}
          {showDepartment && departments.length === 0 && !loading && (
            <div 
              className="absolute top-[36px] left-0 w-full bg-white rounded-lg shadow-lg z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-2 text-sm text-gray-500">
                ไม่มีข้อมูลสาขา
              </div>
            </div>
          )}
        </div>

        {/* Dropdown ประเภท */}
        <div className="relative" style={{ width: "278px", height: "32px" }}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowType(!showType);
              setShowFaculty(false);
              setShowDepartment(false);
            }}
            className="bg-white rounded-full flex items-center justify-between px-6 text-gray-700 cursor-pointer border-none shadow-sm h-full"
          >
            <span className="text-gray-500 text-sm">{type || "ประเภท"}</span>
            <ChevronDown className="text-black" size={16} />
          </div>
          {showType && types.length > 0 && (
            <div 
              className="absolute top-[36px] left-0 w-full bg-white rounded-lg shadow-lg max-h-[200px] overflow-y-auto z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                onClick={() => {
                  setType("");
                  setShowType(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                ทั้งหมด
              </div>
              {types.map((t) => (
                <div
                  key={t}
                  onClick={() => {
                    setType(t);
                    setShowType(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {t}
                </div>
              ))}
            </div>
          )}
          {showType && types.length === 0 && !loading && (
            <div 
              className="absolute top-[36px] left-0 w-full bg-white rounded-lg shadow-lg z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-2 text-sm text-gray-500">
                ไม่มีข้อมูลประเภท
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}