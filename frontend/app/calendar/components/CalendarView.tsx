"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { Calendar, momentLocalizer, ToolbarProps, View } from "react-big-calendar";
import moment from "moment";
import "moment/locale/th";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-custom.css";
import pb from "@/lib/pocketbase";

moment.locale("th");
const localizer = momentLocalizer(moment);

interface Activity {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  isOpen: boolean;
}

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
  const [month, year] = label.split(" ");
  
  return (
    <div className="calendar-toolbar flex items-center justify-between mb-4 px-2 sm:px-4">
      <div className="calendar-title text-[1.5rem] font-bold text-black flex items-end gap-2">
        <span className="font-bold text-[1.3rem]">{month}</span>
        <span className="text-gray-600 text-[1.2rem]">{year}</span>
      </div>

      <div className="calendar-nav-buttons flex gap-2">
        <button onClick={() => onNavigate("PREV")} className="calendar-nav-btn">‹</button>
        <button onClick={() => onNavigate("NEXT")} className="calendar-nav-btn">›</button>
      </div>
    </div>
  );
}

export function CalendarView() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>("month");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const list = await pb.collection("Posts").getList(1, 100, {
          sort: "-created",
          filter: "Verify = true",
        });

        const acts = list.items.map((item: any) => ({
          id: item.id,
          title: item.Topic || "ไม่มีชื่อกิจกรรม",
          startDate: item.OpenRegister || new Date().toISOString(),
          endDate: item.CloseRegister || new Date().toISOString(),
          isOpen: item.Verify ?? false,
        }));

        setActivities(acts);
      } catch (err) {
        console.error("❌ โหลดข้อมูลกิจกรรมไม่สำเร็จ:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  const events = useMemo(() => mapActivitiesToEvents(activities), [activities]);

  if (loading) {
    return (
      <div className="calendar-wrapper bg-[#F8F8F8] py-10 px-6 rounded-lg shadow-sm min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-8 text-black">ปฏิทินกิจกรรม</h1>
        <p className="text-center text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

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
