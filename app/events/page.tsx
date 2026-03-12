import { Suspense } from "react";
import eventsData from "../data.json";
import { EventBrowser } from "./event-browser";

interface SxswEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  tags: string[];
  description: string;
  badge: string;
  source: string;
  categories: string[];
}

function buildCategoryMap(events: SxswEvent[]) {
  const map: Record<string, number> = {};
  for (const e of events) {
    for (const c of e.categories) {
      map[c] = (map[c] || 0) + 1;
    }
  }
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

export default function EventsPage() {
  const events = eventsData as SxswEvent[];
  const categories = buildCategoryMap(events);
  const dates = [...new Set(events.map((e) => e.date))].sort();

  return (
    <Suspense>
      <EventBrowser events={events} categories={categories} dates={dates} />
    </Suspense>
  );
}
