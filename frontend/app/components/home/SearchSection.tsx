// app/components/home/SearchSection.tsx
"use client";

import { ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllTypes, getAllFaculties, getAllDepartments, TypeRecord, Faculty, Department } from "@/lib/pocketbase";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchText, setSearchText] = useState(searchParams.get("q") || "");
  const [selectedFacultyId, setSelectedFacultyId] = useState(searchParams.get("faculty") || "");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(searchParams.get("department") || "");
  const [selectedTypeId, setSelectedTypeId] = useState(searchParams.get("type") || "");
  
  // ✅ State สำหรับเก็บข้อมูลจาก PocketBase
  const [types, setTypes] = useState<TypeRecord[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  
  const [showFaculty, setShowFaculty] = useState(false);
  const [showDepartment, setShowDepartment] = useState(false);
  const [showType, setShowType] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ โหลด Types จาก PocketBase
  useEffect(() => {
    async function loadTypes() {
      try {
        const result = await getAllTypes();
        if (result.success && result.data) {
          setTypes(result.data);
        }
      } catch (error) {
        console.error("❌ โหลด Types ไม่สำเร็จ:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTypes();
  }, []);

  // ✅ โหลด Faculties จาก PocketBase
  useEffect(() => {
    async function loadFaculties() {
      try {
        const result = await getAllFaculties();
        if (result.success && result.data) {
          setFaculties(result.data);
        }
      } catch (error) {
        console.error("❌ โหลด Faculties ไม่สำเร็จ:", error);
      }
    }
    loadFaculties();
  }, []);

  // ✅ โหลด Departments ตาม Faculty ที่เลือก
  useEffect(() => {
    async function loadDepartments() {
      if (!selectedFacultyId) {
        setDepartments([]);
        return;
      }

      try {
        const result = await getAllDepartments(selectedFacultyId);
        if (result.success && result.data) {
          setDepartments(result.data);
        }
      } catch (error) {
        console.error("❌ โหลด Departments ไม่สำเร็จ:", error);
      }
    }
    loadDepartments();
  }, [selectedFacultyId]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchText.trim()) params.set("q", searchText.trim());
    if (selectedFacultyId) params.set("faculty", selectedFacultyId);
    if (selectedDepartmentId) params.set("department", selectedDepartmentId);
    if (selectedTypeId) params.set("type", selectedTypeId);

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

  // ✅ Helper: หาชื่อจาก ID
  const getDisplayName = (id: string, list: any[], nameKey: string) => {
    const item = list.find((x) => x.id === id);
    return item ? item[nameKey] : "";
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
        {/* ✅ Dropdown คณะ */}
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
            <span className="text-gray-500 text-sm truncate">
              {selectedFacultyId 
                ? getDisplayName(selectedFacultyId, faculties, "FacultyName") 
                : "คณะ"}
            </span>
            <ChevronDown className="text-black flex-shrink-0" size={16} />
          </div>
          {showFaculty && (
            <div 
              className="absolute top-[36px] left-0 w-full bg-white rounded-lg shadow-lg max-h-[200px] overflow-y-auto z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                onClick={() => {
                  setSelectedFacultyId("");
                  setSelectedDepartmentId("");
                  setDepartments([]);
                  setShowFaculty(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                ทั้งหมด
              </div>
              {faculties.map((faculty) => (
                <div
                  key={faculty.id}
                  onClick={() => {
                    setSelectedFacultyId(faculty.id);
                    setSelectedDepartmentId(""); // รีเซ็ตสาขา
                    setShowFaculty(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {faculty.FacultyName}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Dropdown สาขา */}
        <div className="relative" style={{ width: "278px", height: "32px" }}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (selectedFacultyId) {
                setShowDepartment(!showDepartment);
                setShowFaculty(false);
                setShowType(false);
              }
            }}
            className={`bg-white rounded-full flex items-center justify-between px-6 text-gray-700 border-none shadow-sm h-full ${
              selectedFacultyId ? "cursor-pointer" : "cursor-not-allowed opacity-50"
            }`}
          >
            <span className="text-gray-500 text-sm truncate">
              {selectedDepartmentId 
                ? getDisplayName(selectedDepartmentId, departments, "DepartmentName") 
                : "สาขา"}
            </span>
            <ChevronDown className="text-black flex-shrink-0" size={16} />
          </div>
          {showDepartment && departments.length > 0 && (
            <div 
              className="absolute top-[36px] left-0 w-full bg-white rounded-lg shadow-lg max-h-[200px] overflow-y-auto z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                onClick={() => {
                  setSelectedDepartmentId("");
                  setShowDepartment(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                ทั้งหมด
              </div>
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  onClick={() => {
                    setSelectedDepartmentId(dept.id);
                    setShowDepartment(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {dept.DepartmentName}
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

        {/* ✅ Dropdown ประเภท */}
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
            <span className="text-gray-500 text-sm truncate">
              {selectedTypeId 
                ? getDisplayName(selectedTypeId, types, "TypeName") 
                : "ประเภท"}
            </span>
            <ChevronDown className="text-black flex-shrink-0" size={16} />
          </div>
          {showType && types.length > 0 && (
            <div 
              className="absolute top-[36px] left-0 w-full bg-white rounded-lg shadow-lg max-h-[200px] overflow-y-auto z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                onClick={() => {
                  setSelectedTypeId("");
                  setShowType(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                ทั้งหมด
              </div>
              {types.map((type) => (
                <div
                  key={type.id}
                  onClick={() => {
                    setSelectedTypeId(type.id);
                    setShowType(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {type.TypeName}
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