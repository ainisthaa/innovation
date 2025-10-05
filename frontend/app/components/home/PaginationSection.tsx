"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function PaginationSection() {
  return (
    <div className="flex justify-center items-center gap-2">
      <button className="p-2 border rounded-full">
        <ChevronLeft size={16} />
      </button>

      {[1, 2, 3, "...", 10].map((page, idx) => (
        <button
          key={idx}
          className={`w-8 h-8 rounded-full ${
            page === 1
              ? "bg-[#FF9236] text-white font-bold"
              : "bg-white border text-black"
          }`}
        >
          {page}
        </button>
      ))}

      <button className="p-2 border rounded-full">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
