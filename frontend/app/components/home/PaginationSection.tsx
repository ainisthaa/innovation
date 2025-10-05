"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationSection({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const generatePages = () => {
    const pages = [];

    if (totalPages <= 5) {
      // กรณีหน้าน้อยกว่า 5 หน้า → แสดงทั้งหมด
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // กรณีมีหลายหน้า
      if (currentPage <= 3) {
        // ช่วงต้น
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        // ช่วงท้าย
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        // ช่วงกลาง
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <div className="flex justify-center items-center gap-2">
      {/* ปุ่มย้อนกลับ */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 bg-white border rounded-full disabled:opacity-30 hover:bg-gray-100 transition-all"
      >
        <ChevronLeft size={16} />
      </button>

      {/* แสดงหมายเลขหน้า */}
      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="w-8 h-8 flex items-center justify-center text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={idx}
            onClick={() => onPageChange(Number(page))}
            className={`w-8 h-8 rounded-full text-sm font-semibold transition-all ${
              page === currentPage
                ? "bg-[#FF9236] text-white font-bold"
                : "bg-white border text-black hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* ปุ่มไปหน้าถัดไป */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 bg-white border rounded-full disabled:opacity-30 hover:bg-gray-100 transition-all"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
