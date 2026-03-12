"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  name: string;
  count: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Artificial Intelligence": "bg-nb-sky",
  "Education": "bg-nb-yellow",
  "Marketing & Branding": "bg-nb-orange",
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

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: d.getDate(),
  };
}

export function WelcomePage({
  categories,
  dates,
  totalEvents,
}: {
  categories: Category[];
  dates: string[];
  totalEvents: number;
}) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedCategories(new Set(categories.map((c) => c.name)));
  };

  const clearAll = () => {
    setSelectedCategories(new Set());
  };

  const handleExplore = () => {
    const params = new URLSearchParams();
    if (selectedDate) params.set("date", selectedDate);
    if (selectedCategories.size > 0 && selectedCategories.size < categories.length) {
      params.set("categories", [...selectedCategories].join(","));
    }
    router.push(`/events${params.toString() ? "?" + params.toString() : ""}`);
  };

  const canExplore = selectedCategories.size > 0;

  return (
    <div className="min-h-screen bg-nb-bg">
      {/* Hero */}
      <div className="border-b-[3.5px] border-nb-black bg-nb-orange">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="inline-block bg-nb-black text-nb-white px-4 py-1 border-[3px] border-nb-black shadow-[4px_4px_0px_#FDFD96] mb-6">
            <span className="font-heading text-sm font-black uppercase tracking-wider">
              March 12–18, 2026 &middot; Austin, TX
            </span>
          </div>
          <h1 className="font-heading font-black text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.9] text-nb-black mb-6">
            SXSW<br />
            <span className="text-nb-white">2026</span>
          </h1>
          <p className="font-body text-lg md:text-xl text-nb-black/80 max-w-xl font-medium">
            {totalEvents} sessions across tech, design, AI, and more.
            Pick your dates and interests to build your schedule.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Step 1: Date */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-nb-black text-nb-white font-heading font-black text-lg border-[3px] border-nb-black shadow-[3px_3px_0px_#FF5733]">
              1
            </span>
            <h2 className="font-heading font-black text-2xl md:text-3xl uppercase">
              Pick a Date
            </h2>
            <span className="font-body text-sm text-nb-black/50 ml-2">(optional)</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {dates.map((date) => {
              const { weekday, month, day } = formatDateLabel(date);
              const isSelected = selectedDate === date;
              return (
                <button
                  key={date}
                  onClick={() =>
                    setSelectedDate(isSelected ? null : date)
                  }
                  className={`flex flex-col items-center px-5 py-3 border-[3px] border-nb-black transition-all duration-150 cursor-pointer select-none
                    ${
                      isSelected
                        ? "bg-nb-black text-nb-white shadow-none translate-x-[4px] translate-y-[4px]"
                        : "bg-nb-white text-nb-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]"
                    }`}
                >
                  <span className="font-heading font-black text-[10px] uppercase tracking-wider opacity-60">
                    {weekday}
                  </span>
                  <span className="font-heading font-black text-2xl leading-none">
                    {day}
                  </span>
                  <span className="font-heading font-black text-[10px] uppercase tracking-wider opacity-60">
                    {month}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2: Categories */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-nb-black text-nb-white font-heading font-black text-lg border-[3px] border-nb-black shadow-[3px_3px_0px_#FF5733]">
              2
            </span>
            <h2 className="font-heading font-black text-2xl md:text-3xl uppercase">
              Choose Categories
            </h2>
          </div>
          <div className="flex gap-3 mb-6">
            <button
              onClick={selectAll}
              className="font-heading font-black text-xs uppercase px-4 py-2 bg-nb-white border-[2.5px] border-nb-black shadow-[3px_3px_0px_#000] hover:shadow-[1.5px_1.5px_0px_#000] hover:translate-x-[1.5px] hover:translate-y-[1.5px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150 cursor-pointer"
            >
              Select All
            </button>
            <button
              onClick={clearAll}
              className="font-heading font-black text-xs uppercase px-4 py-2 bg-nb-white border-[2.5px] border-nb-black shadow-[3px_3px_0px_#000] hover:shadow-[1.5px_1.5px_0px_#000] hover:translate-x-[1.5px] hover:translate-y-[1.5px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150 cursor-pointer"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {categories.map((cat) => {
              const isSelected = selectedCategories.has(cat.name);
              const bgColor = CATEGORY_COLORS[cat.name] || "bg-nb-white";
              return (
                <button
                  key={cat.name}
                  onClick={() => toggleCategory(cat.name)}
                  className={`flex items-center gap-3 px-4 py-3 border-[3px] border-nb-black text-left transition-all duration-150 cursor-pointer select-none
                    ${
                      isSelected
                        ? `${bgColor} shadow-none translate-x-[4px] translate-y-[4px]`
                        : `bg-nb-white shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]`
                    }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 border-[2.5px] border-nb-black shrink-0 font-body text-sm
                      ${isSelected ? "bg-nb-black text-nb-white" : "bg-nb-white"}`}
                  >
                    {isSelected ? "✓" : ""}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="font-heading font-black text-sm uppercase block truncate">
                      {cat.name}
                    </span>
                  </span>
                  <span className="font-heading font-black text-xs bg-nb-black text-nb-white px-2 py-0.5 shrink-0">
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Explore button */}
        <section className="pb-16">
          <button
            onClick={handleExplore}
            disabled={!canExplore}
            className={`w-full sm:w-auto px-12 py-5 font-heading font-black text-xl uppercase border-[3.5px] border-nb-black transition-all duration-150 cursor-pointer
              ${
                canExplore
                  ? "bg-nb-orange text-nb-white shadow-[6px_6px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] active:shadow-none active:translate-x-[6px] active:translate-y-[6px]"
                  : "bg-nb-black/20 text-nb-black/40 shadow-none cursor-not-allowed"
              }`}
          >
            Explore {selectedCategories.size > 0 ? `${selectedCategories.size} ` : ""}
            {selectedCategories.size === 1 ? "Category" : "Categories"} →
          </button>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t-[3.5px] border-nb-black bg-nb-black text-nb-white">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="font-heading font-black text-sm uppercase">
            SXSW 2026 Sessions Explorer
          </span>
          <span className="font-body text-sm text-nb-white/50">
            Data scraped from schedule.sxsw.com
          </span>
        </div>
      </footer>
    </div>
  );
}
