import eventsData from "./data.json";
import { WelcomePage } from "./welcome";

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

function getUniqueData(events: SxswEvent[]) {
  const catMap: Record<string, number> = {};
  const dateSet = new Set<string>();
  for (const e of events) {
    dateSet.add(e.date);
    for (const c of e.categories) {
      catMap[c] = (catMap[c] || 0) + 1;
    }
  }
  const categories = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
  const dates = [...dateSet].sort();
  return { categories, dates };
}

export default function Home() {
  const events = eventsData as SxswEvent[];
  const { categories, dates } = getUniqueData(events);

  return (
    <WelcomePage
      categories={categories}
      dates={dates}
    />
  );
}
