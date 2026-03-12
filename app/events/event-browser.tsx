"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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
  locationAddress?: string;
}

interface Category {
  name: string;
  count: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Artificial Intelligence": "bg-nb-sky",
  "Education": "bg-nb-yellow",
  "Marketing & Branding": "bg-nb-orange text-nb-white",
  "Entrepreneurship & Startups": "bg-nb-green-light",
  "Design & Creative": "bg-nb-violet",
  "Health & Wellness": "bg-nb-pale-cyan",
  "Ethics & Policy": "bg-nb-pale-red",
  "Future of Work": "bg-nb-sky",
  "Climate & Sustainability": "bg-nb-green-light",
  "Creator Economy": "bg-nb-yellow",
  "Data & Analytics": "bg-nb-pale-cyan",
  "Gaming & Interactive": "bg-nb-violet",
  "Robotics & Hardware": "bg-nb-sky",
  "Space & Science": "bg-nb-yellow",
  "Media & Entertainment": "bg-nb-pale-red",
  "Social Impact": "bg-nb-green-light",
  "Cybersecurity": "bg-nb-pale-red",
  "Smart Cities & Infrastructure": "bg-nb-pale-cyan",
  "Finance & Fintech": "bg-nb-yellow",
  "General": "bg-nb-white",
};

// Parse "10:00 AM" or "2:30 PM" from event time string to minutes since midnight
function parseEventStartTime(timeStr: string): number | null {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function minutesToLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).toUpperCase();
}

export function EventBrowser({
  events,
  categories,
  dates,
}: {
  events: SxswEvent[];
  categories: Category[];
  dates: string[];
}) {
  const searchParams = useSearchParams();

  const initialCategories = searchParams.get("categories");
  const initialDate = searchParams.get("date");

  const [filterDate, setFilterDate] = useState<string>(initialDate || "");
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Compute global min/max event times
  const { globalMin, globalMax } = useMemo(() => {
    let min = 24 * 60, max = 0;
    for (const e of events) {
      const t = parseEventStartTime(e.time);
      if (t !== null) {
        if (t < min) min = t;
        if (t > max) max = t;
      }
    }
    min = Math.floor(min / 60) * 60;
    max = Math.ceil((max + 1) / 60) * 60;
    return { globalMin: min, globalMax: max };
  }, [events]);

  const [timeRange, setTimeRange] = useState<[number, number]>([globalMin, globalMax]);

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(() => {
    if (initialCategories) {
      return new Set(initialCategories.split(","));
    }
    return new Set(categories.map((c) => c.name));
  });

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let result = events.filter((e) =>
      e.categories.some((c) => selectedCategories.has(c))
    );
    if (filterDate) {
      result = result.filter((e) => e.date === filterDate);
    }
    if (timeRange[0] !== globalMin || timeRange[1] !== globalMax) {
      result = result.filter((e) => {
        const eventStart = parseEventStartTime(e.time);
        if (eventStart === null) return true;
        return eventStart >= timeRange[0] && eventStart <= timeRange[1];
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    result.sort((a, b) => {
      const d = a.date.localeCompare(b.date);
      if (d !== 0) return d;
      return a.time.localeCompare(b.time);
    });
    return result;
  }, [events, selectedCategories, filterDate, timeRange, globalMin, globalMax, search]);

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, SxswEvent[]> = {};
    for (const e of filtered) {
      if (!groups[e.date]) groups[e.date] = [];
      groups[e.date].push(e);
    }
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  // Shared sidebar content
  const sidebarContent = (
    <>
      <div className="p-4 border-b-[3px] border-nb-black bg-nb-black flex items-center justify-between">
        <h2 className="font-heading font-black text-xs uppercase tracking-wider text-nb-white">
          Categories
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCategories(new Set(categories.map((c) => c.name)))}
            className="font-heading font-black text-[10px] uppercase px-1.5 py-0.5 bg-nb-white text-nb-black border-[2px] border-nb-white hover:bg-nb-yellow cursor-pointer transition-colors duration-150"
          >
            All
          </button>
          <button
            onClick={() => setSelectedCategories(new Set())}
            className="font-heading font-black text-[10px] uppercase px-1.5 py-0.5 bg-transparent text-nb-white/60 border-[2px] border-nb-white/30 hover:border-nb-white hover:text-nb-white cursor-pointer transition-colors duration-150"
          >
            None
          </button>
          {/* Close button — mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden font-heading font-black text-sm w-6 h-6 flex items-center justify-center bg-nb-white text-nb-black cursor-pointer ml-1"
          >
            ✕
          </button>
        </div>
      </div>
      <nav className="py-2">
        {categories.map((cat) => {
          const isSelected = selectedCategories.has(cat.name);
          const colorClass = CATEGORY_COLORS[cat.name] || "bg-nb-white";
          return (
            <button
              key={cat.name}
              onClick={() => toggleCategory(cat.name)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150 border-b-[2px] border-nb-black/10 cursor-pointer
                ${isSelected ? `${colorClass}` : "bg-transparent opacity-50 hover:opacity-75"}`}
            >
              <span
                className={`inline-flex items-center justify-center w-5 h-5 border-[2.5px] border-nb-black shrink-0 text-xs
                  ${isSelected ? "bg-nb-black text-nb-white" : "bg-nb-white"}`}
              >
                {isSelected ? "✓" : ""}
              </span>
              <span className="flex-1 min-w-0">
                <span className="font-heading font-black text-xs uppercase block truncate">
                  {cat.name}
                </span>
              </span>
              <span
                className={`font-heading font-black text-[10px] px-2 py-0.5 border-[2px] border-nb-black
                  ${isSelected ? "bg-nb-black text-nb-white" : "bg-nb-white text-nb-black"}`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="flex flex-col h-screen bg-nb-bg">
      {/* Header */}
      <header className="shrink-0 border-b-[3.5px] border-nb-black bg-nb-orange">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/"
              className="font-heading font-black text-xl md:text-2xl text-nb-black uppercase hover:text-nb-white transition-colors duration-150"
            >
              SXSW <span className="text-nb-white">2026</span>
            </Link>
            <div className="h-6 w-[3px] bg-nb-black/30 hidden sm:block" />
            <Link
              href="/"
              className="inline-flex items-center justify-center w-8 h-8 bg-nb-black text-nb-white border-[2.5px] border-nb-black shadow-[3px_3px_0px_#FDFD96] hover:shadow-[1.5px_1.5px_0px_#FDFD96] hover:translate-x-[1.5px] hover:translate-y-[1.5px] transition-all duration-150 font-black text-sm"
            >
              ←
            </Link>
            <span className="font-heading font-black text-xs uppercase tracking-wider text-nb-black/70 hidden sm:inline">
              Sessions
            </span>
          </div>
          {/* Mobile: category toggle button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden font-heading font-black text-xs uppercase px-3 py-1.5 bg-nb-black text-nb-white border-[2.5px] border-nb-black shadow-[3px_3px_0px_#FDFD96] hover:shadow-[1.5px_1.5px_0px_#FDFD96] hover:translate-x-[1.5px] hover:translate-y-[1.5px] transition-all duration-150 cursor-pointer"
          >
            Categories ({selectedCategories.size})
          </button>
        </div>
      </header>

      {/* Split view */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-nb-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar — fixed on mobile, static on desktop */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-nb-cream border-r-[3.5px] border-nb-black overflow-y-auto transition-transform duration-200
            lg:static lg:shrink-0 lg:translate-x-0 lg:z-auto
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {sidebarContent}
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Toolbar */}
          <div className="shrink-0 border-b-[3px] border-nb-black bg-nb-white px-4 md:px-6 py-3">
            {/* Row 1: count + filters */}
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <span className="font-heading font-black text-xs bg-nb-black text-nb-white px-2 py-0.5 whitespace-nowrap">
                {filtered.length} sessions
              </span>

              <div className="flex-1 min-w-0" />

              {/* Date filter */}
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="font-heading font-black text-xs uppercase bg-nb-white border-[2.5px] border-nb-black shadow-[3px_3px_0px_#000] px-2 md:px-3 py-1.5 cursor-pointer focus:outline-none appearance-none pr-7"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 2px center",
                  backgroundSize: "18px",
                }}
              >
                <option value="">All Dates</option>
                {dates.map((d) => (
                  <option key={d} value={d}>
                    {formatDate(d)}
                  </option>
                ))}
              </select>

              {/* Time slider — hidden on very small screens */}
              <div className="hidden sm:block">
                <TimeRangeSlider
                  min={globalMin}
                  max={globalMax}
                  value={timeRange}
                  onChange={setTimeRange}
                />
              </div>

              {/* Search */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH..."
                className="w-full sm:w-44 md:w-56 bg-nb-white border-[2.5px] border-nb-black shadow-[3px_3px_0px_#000] px-3 py-1.5 font-heading font-black text-xs uppercase placeholder:text-nb-black/30 focus:shadow-[1.5px_1.5px_0px_#000] focus:translate-x-[1.5px] focus:translate-y-[1.5px] focus:outline-none transition-all duration-150 order-last sm:order-none"
              />
            </div>

            {/* Mobile time slider — shown below on small screens */}
            <div className="sm:hidden mt-2">
              <TimeRangeSlider
                min={globalMin}
                max={globalMax}
                value={timeRange}
                onChange={setTimeRange}
              />
            </div>
          </div>

          {/* Events */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
            {grouped.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="bg-nb-white border-[3px] border-nb-black shadow-[6px_6px_0px_#000] px-8 py-6 text-center">
                  <span className="font-heading font-black text-lg uppercase">
                    No Sessions Found
                  </span>
                </div>
              </div>
            ) : (
              grouped.map(([date, dateEvents]) => (
                <div key={date} className="mb-6">
                  {/* Date header */}
                  <div className="sticky top-0 z-10 mb-3">
                    <span className="inline-block font-heading font-black text-sm uppercase bg-nb-black text-nb-white px-4 py-1.5 border-[3px] border-nb-black shadow-[3px_3px_0px_#FF5733]">
                      {formatDate(date)}
                    </span>
                  </div>

                  {/* Event cards */}
                  <div className="bg-nb-white border-[3px] border-nb-black shadow-[4px_4px_0px_#000] md:shadow-[6px_6px_0px_#000]">
                    {/* Table header — desktop only */}
                    <div className="hidden lg:grid grid-cols-[24px_180px_1fr_200px] border-b-[3px] border-nb-black bg-nb-black text-nb-white px-4 py-2 font-heading font-black text-[10px] uppercase tracking-wider">
                      <span></span>
                      <span>Time</span>
                      <span>Session</span>
                      <span>Location</span>
                    </div>

                    {dateEvents.map((event, idx) => (
                      <EventRow
                        key={event.id}
                        event={event}
                        isExpanded={expandedEvent === event.id}
                        onToggle={() =>
                          setExpandedEvent(
                            expandedEvent === event.id ? null : event.id
                          )
                        }
                        isLast={idx === dateEvents.length - 1}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function EventRow({
  event,
  isExpanded,
  onToggle,
  isLast,
}: {
  event: SxswEvent;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  return (
    <>
      <div
        onClick={onToggle}
        className={`grid grid-cols-[20px_1fr] lg:grid-cols-[24px_180px_1fr_200px] px-3 md:px-4 py-3 cursor-pointer transition-all duration-150
          ${!isLast && !isExpanded ? "border-b-[2px] border-nb-black/15" : ""}
          ${isExpanded ? "bg-nb-yellow/30 border-b-[2px] border-nb-black/30" : "hover:bg-nb-bg/50"}`}
      >
        {/* Arrow */}
        <div className="flex items-center justify-center self-start h-[18px]">
          <span
            className={`font-black text-[10px] lg:text-xs transition-transform duration-150 inline-block
              ${isExpanded ? "rotate-90" : ""}`}
          >
            ▶
          </span>
        </div>

        {/* Time — desktop column */}
        <div className="hidden lg:flex items-center self-start h-[18px]">
          <span className="font-heading font-black text-[11px] uppercase text-nb-black/60 whitespace-nowrap">
            {event.time}
          </span>
        </div>

        {/* Title + mobile meta */}
        <div className="min-w-0">
          {/* Mobile: time + location on top */}
          <div className="lg:hidden flex flex-wrap gap-x-3 gap-y-0.5 mb-0.5">
            <span className="font-heading font-black text-[10px] uppercase text-nb-black/50">
              {event.time}
            </span>
            {event.location && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.locationAddress || event.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-body text-[10px] text-nb-black/40 truncate hover:text-nb-orange transition-colors duration-150 underline decoration-nb-black/20 hover:decoration-nb-orange"
              >
                {event.location}
              </a>
            )}
          </div>
          <span className="font-heading font-black text-xs md:text-sm uppercase leading-snug block">
            {event.title}
          </span>
          {!isExpanded && event.description && (
            <span className="font-body text-[11px] text-nb-black/50 line-clamp-1 mt-0.5 block">
              {event.description}
            </span>
          )}
        </div>

        {/* Location — desktop only */}
        <div className="hidden lg:flex items-start">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.locationAddress || event.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-body text-xs text-nb-black/60 truncate hover:text-nb-orange transition-colors duration-150 underline decoration-nb-black/20 hover:decoration-nb-orange"
          >
            {event.location}
          </a>
        </div>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div
          className={`px-3 md:px-4 py-4 md:py-5 bg-nb-cream ${
            !isLast ? "border-b-[2px] border-nb-black/30" : ""
          }`}
        >
          <div className="max-w-3xl space-y-3 md:space-y-4 ml-0 lg:ml-[204px]">
            {/* Meta row */}
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.locationAddress || event.location || "TBA")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-block font-heading font-black text-[9px] md:text-[10px] uppercase px-2 py-1 bg-nb-white border-[2px] border-nb-black shadow-[2px_2px_0px_#000] hover:bg-nb-orange hover:text-nb-white transition-colors duration-150"
              >
                📍 {event.location || "TBA"}
              </a>
              <span className="inline-block font-heading font-black text-[9px] md:text-[10px] uppercase px-2 py-1 bg-nb-white border-[2px] border-nb-black shadow-[2px_2px_0px_#000]">
                🕐 {event.time}
              </span>
              <span className="inline-block font-heading font-black text-[9px] md:text-[10px] uppercase px-2 py-1 bg-nb-white border-[2px] border-nb-black shadow-[2px_2px_0px_#000]">
                📅 {formatDate(event.date)}
              </span>
            </div>

            {/* Embedded Map */}
            {(event.locationAddress || event.location) && (
              <div className="border-[3px] border-nb-black shadow-[4px_4px_0px_#000] overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(event.locationAddress || event.location)}&output=embed`}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map: ${event.location}`}
                />
                <div className="bg-nb-white px-3 py-1.5 border-t-[2px] border-nb-black">
                  <span className="font-body text-[11px] text-nb-black/60">
                    {event.locationAddress || event.location}
                  </span>
                </div>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <p className="font-body text-sm text-nb-black/80 leading-relaxed">
                {event.description}
              </p>
            )}

            {/* Tags */}
            {event.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-heading font-black text-[10px] uppercase px-2 py-0.5 bg-nb-orange text-nb-white border-[2px] border-nb-black"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Categories */}
            <div className="flex flex-wrap gap-1.5">
              {event.categories.map((cat) => (
                <span
                  key={cat}
                  className={`font-heading font-black text-[10px] uppercase px-2 py-0.5 border-[2px] border-nb-black ${
                    CATEGORY_COLORS[cat] || "bg-nb-white"
                  }`}
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Badge & Link */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
              {event.badge && (
                <span className="font-body text-xs text-nb-black/50 truncate max-w-full">
                  🎫 {event.badge}
                </span>
              )}
              <a
                href={event.source}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-block font-heading font-black text-xs uppercase px-3 py-1.5 bg-nb-black text-nb-white border-[2.5px] border-nb-black shadow-[3px_3px_0px_#FF5733] hover:shadow-[1.5px_1.5px_0px_#FF5733] hover:translate-x-[1.5px] hover:translate-y-[1.5px] transition-all duration-150 shrink-0"
              >
                View on SXSW →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Dual-thumb time range slider ── */

function TimeRangeSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"start" | "end" | null>(null);

  const range = max - min || 1;
  const startPct = ((value[0] - min) / range) * 100;
  const endPct = ((value[1] - min) / range) * 100;

  const getMinutesFromX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return min;
      const rect = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const raw = min + pct * range;
      return Math.round(raw / 30) * 30;
    },
    [min, range]
  );

  const handlePointerDown = useCallback(
    (thumb: "start" | "end") => (e: React.PointerEvent) => {
      e.preventDefault();
      dragging.current = thumb;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const mins = getMinutesFromX(e.clientX);
      if (dragging.current === "start") {
        onChange([Math.min(mins, value[1] - 30), value[1]]);
      } else {
        onChange([value[0], Math.max(mins, value[0] + 30)]);
      }
    },
    [getMinutesFromX, onChange, value]
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  const isFiltered = value[0] !== min || value[1] !== max;

  return (
    <div className="flex items-center gap-2 bg-nb-bg border-[2.5px] border-nb-black shadow-[3px_3px_0px_#000] px-2 md:px-3 py-1.5 w-full sm:w-auto">
      <span className="font-heading font-black text-[9px] md:text-[10px] uppercase whitespace-nowrap text-nb-black/70">
        {minutesToLabel(value[0])}
      </span>

      <div
        ref={trackRef}
        className="relative flex-1 sm:w-28 md:w-36 h-5 flex items-center cursor-pointer touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Track bg */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[6px] bg-nb-black/15 border-[2px] border-nb-black" />

        {/* Active range */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[6px] bg-nb-orange"
          style={{ left: `${startPct}%`, right: `${100 - endPct}%` }}
        />

        {/* Start thumb */}
        <div
          onPointerDown={handlePointerDown("start")}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 md:w-4 md:h-4 bg-nb-white border-[2.5px] border-nb-black shadow-[2px_2px_0px_#000] hover:bg-nb-yellow cursor-grab active:cursor-grabbing z-10"
          style={{ left: `${startPct}%` }}
        />

        {/* End thumb */}
        <div
          onPointerDown={handlePointerDown("end")}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 md:w-4 md:h-4 bg-nb-white border-[2.5px] border-nb-black shadow-[2px_2px_0px_#000] hover:bg-nb-yellow cursor-grab active:cursor-grabbing z-10"
          style={{ left: `${endPct}%` }}
        />
      </div>

      <span className="font-heading font-black text-[9px] md:text-[10px] uppercase whitespace-nowrap text-nb-black/70">
        {minutesToLabel(value[1])}
      </span>

      {isFiltered && (
        <button
          onClick={() => onChange([min, max])}
          className="font-heading font-black text-[10px] w-5 h-5 flex items-center justify-center bg-nb-black text-nb-white cursor-pointer hover:bg-nb-orange transition-colors duration-150 shrink-0"
        >
          ✕
        </button>
      )}
    </div>
  );
}
