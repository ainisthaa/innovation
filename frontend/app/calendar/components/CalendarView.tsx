"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Calendar, momentLocalizer, ToolbarProps, View } from "react-big-calendar";
import moment from "moment";
import "moment/locale/th";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-custom.css";

moment.locale("th");
const localizer = momentLocalizer(moment);

interface Activity {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  isOpen: boolean;
}

const mockActivities: Activity[] = [
  { id: 1, title: "CS CAMP", startDate: "2025-10-01", endDate: "2025-10-01", isOpen: true },
  { id: 2, title: "CS CAMP", startDate: "2025-10-01", endDate: "2025-10-01", isOpen: true },
  { id: 3, title: "CS CAMP", startDate: "2025-10-01", endDate: "2025-10-01", isOpen: true },
  { id: 4, title: "CS CAMP", startDate: "2025-10-07", endDate: "2025-10-07", isOpen: true },
  { id: 5, title: "CS CAMP", startDate: "2025-10-10", endDate: "2025-10-10", isOpen: true },
  { id: 6, title: "CS CAMP", startDate: "2025-10-16", endDate: "2025-10-16", isOpen: true },
  { id: 7, title: "CS CAMP", startDate: "2025-10-21", endDate: "2025-10-21", isOpen: true },
  { id: 8, title: "CS CAMP", startDate: "2025-10-25", endDate: "2025-10-25", isOpen: true },
];

function mapActivitiesToEvents(acts: Activity[]) {
  const colors = ["#FF9236", "#3B82F6", "#22C55E", "#F97316"];
  return acts.map((a, i) => ({
    id: a.id,
    title: a.title,
    start: new Date(a.startDate),
    end: new Date(a.endDate),
    color: colors[i % colors.length],
  }));
}

function MyToolbar(props: ToolbarProps) {
  const { label, onNavigate } = props;

  // แยกชื่อเดือนและปี
  const [month, year] = label.split(" ");
  return (
    <div className="calendar-toolbar flex items-center justify-between mb-4 px-2 sm:px-4">
      <div className="calendar-title text-[1.5rem] font-bold text-black flex items-end gap-2">
        <span className="font-bold text-[1.3rem]">{month}</span>
        <span className="text-gray-600 text-[1.2rem]">{year}</span>
      </div>

      <div className="calendar-nav-buttons flex gap-2">
        <button
          onClick={() => onNavigate("PREV")}
          className="calendar-nav-btn"
        >
          ‹
        </button>
        <button
          onClick={() => onNavigate("NEXT")}
          className="calendar-nav-btn"
        >
          ›
        </button>
      </div>
    </div>
  );
}

export function CalendarView() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>("month");

  const events = useMemo(() => mapActivitiesToEvents(mockActivities), []);

  return (
    <div className="calendar-wrapper bg-[#F8F8F8] py-10 px-6 rounded-lg shadow-sm min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">ปฏิทินกิจกรรม</h1>

      <div className="bg-white p-8 rounded-xl shadow calendar-box mx-auto max-w-5xl">
        <Calendar
          localizer={localizer}
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          onView={(v) => setView(v)}
          view={view}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          views={["month"]}
          components={{
            toolbar: MyToolbar,
            event: ({ event }: any) => (
              <div
                className="text-white text-xs px-2 py-[3px] rounded-md font-semibold truncate text-center"
                style={{ backgroundColor: event.color }}
              >
                {event.title}
              </div>
            ),
          }}
          messages={{
            month: "เดือน",
            next: ">",
            previous: "<",
            today: "วันนี้",
          }}
          onSelectEvent={(event: any) => router.push(`/activities/${event.id}`)}
        />
      </div>
    </div>
  );
}
