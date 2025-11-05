"use client";

import { ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import pb from "@/lib/pocketbase";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get("q") || "");
  const [faculty, setFaculty] = useState(searchParams.get("faculty") || "");
  const [department, setDepartment] = useState(searchParams.get("department") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  
  const [faculties, setFaculties] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  
  const [showFaculty, setShowFaculty] = useState(false);
  const [showDepartment, setShowDepartment] = useState(false);
  const [showType, setShowType] = useState(false);

  useEffect(() => {
    async function fetchFilters() {
      try {
        const list = await pb.collection("Posts").getList(1, 500, {
          fields: "Faculty,Department,Type",
        });

        const facultySet = new Set<string>();
        const departmentSet = new Set<string>();
        const typeSet = new Set<string>();

        list.items.forEach((item: any) => {
          if (item.Faculty) facultySet.add(item.Faculty);
          if (item.Department) departmentSet.add(item.Department);
          if (item.Type) typeSet.add(item.Type);
        });

        setFaculties(Array.from(facultySet).sort());
        setDepartments(Array.from(departmentSet).sort());
        setTypes(Array.from(typeSet).sort());
      } catch (err) {
        console.error("❌ โหลดตัวกรองไม่สำเร็จ:", err);
      }
    }

    fetchFilters();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchText) params.set("q", searchText);
    if (faculty) params.set("faculty", faculty);
    if (department) params.set("department", department);
    if (type) params.set("type", type);

    router.push(`/?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

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
            onClick={() => setShowFaculty(!showFaculty)}
            className="bg-white rounded-full flex items-center justify-between px-6 text-gray-700 cursor-pointer border-none shadow-sm h-full"
          >
            <span className="text-gray-500 text-sm">{faculty || "คณะ"}</span>
            <ChevronDown className="text-black" size={16} />
          </div>
          {showFaculty && faculties.length > 0 && (
            <div className="absolute top-[36px] left-0 w-full bg-white rounded-lg shadow-lg max-h-[200px] overflow-y-auto z-10">
              <div
                onClick={() => {
                  setFaculty("");
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
            onClick={() => setShowDepartment(!showDepartment)}
            className="bg-white rounded-full flex items-center justify-between px-6 text-gray-700 cursor-pointer border-none shadow-sm h-full"
          >
            <span className="text-gray-500 text-sm">{department || "สาขา"}</span>
            <ChevronDown className="text-black" size={16} />
          </div>
          {showDepartment && departments.length > 0 && (
            <div className="absolute top-[36px] left-0 w-full bg-white rounded-lg shadow-lg max-h-[200px] overflow-y-auto z-10">
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
        </div>

        {/* Dropdown ประเภท */}
        <div className="relative" style={{ width: "278px", height: "32px" }}>
          <div
            onClick={() => setShowType(!showType)}
            className="bg-white rounded-full flex items-center justify-between px-6 text-gray-700 cursor-pointer border-none shadow-sm h-full"
          >
            <span className="text-gray-500 text-sm">{type || "ประเภท"}</span>
            <ChevronDown className="text-black" size={16} />
          </div>
          {showType && types.length > 0 && (
            <div className="absolute top-[36px] left-0 w-full bg-white rounded-lg shadow-lg max-h-[200px] overflow-y-auto z-10">
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
        </div>
      </div>
    </div>
  );
}
