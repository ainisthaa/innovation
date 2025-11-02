import { CalendarView } from "./components/CalendarView";
import { UpcomingActivities } from "./components/UpcomingActivities";

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-[#F8F8F8] pb-20">
      <section className="max-w-6xl mx-auto px-4 pt-10">
        <CalendarView />
        <UpcomingActivities />
      </section>
    </main>
  );
}
