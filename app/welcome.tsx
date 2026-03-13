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
}: {
  categories: Category[];
  dates: string[];
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-24">
          <div className="inline-block bg-nb-black text-nb-white px-3 sm:px-4 py-1 border-[3px] border-nb-black shadow-[4px_4px_0px_#FDFD96] mb-4 sm:mb-6">
            <span className="font-heading text-xs sm:text-sm font-black uppercase tracking-wider">
              March 12–18, 2026 &middot; Austin, TX
            </span>
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.9] text-nb-black mb-4 sm:mb-6">
            SXSW<br />
            <span className="text-nb-white">2026</span>
          </h1>
          <p className="font-body text-base sm:text-lg md:text-xl text-nb-black/80 max-w-xl font-medium">
            Sessions across tech, design, AI, and more.
            Pick your dates and interests to build your schedule.
          </p>
          <p className="font-body text-xs sm:text-sm text-nb-black/60 max-w-xl mt-3 sm:mt-4">
            This is not an official SXSW website. It is a community-built tool designed to help attendees discover and plan sessions that match their interests.
            Visit the official site at{" "}
            <a
              href="https://www.sxsw.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold text-nb-black/80 hover:text-nb-white transition-colors duration-150"
            >
              sxsw.com
            </a>.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Step 1: Date */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-nb-black text-nb-white font-heading font-black text-base sm:text-lg border-[3px] border-nb-black shadow-[3px_3px_0px_#FF5733]">
              1
            </span>
            <h2 className="font-heading font-black text-xl sm:text-2xl md:text-3xl uppercase">
              Pick a Date
            </h2>
            <span className="font-body text-xs sm:text-sm text-nb-black/50">(optional)</span>
          </div>

          <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-2 sm:gap-3">
            {dates.map((date) => {
              const { weekday, month, day } = formatDateLabel(date);
              const isSelected = selectedDate === date;
              return (
                <button
                  key={date}
                  onClick={() =>
                    setSelectedDate(isSelected ? null : date)
                  }
                  className={`flex flex-col items-center px-2 sm:px-5 py-2 sm:py-3 border-[3px] border-nb-black transition-all duration-150 cursor-pointer select-none
                    ${
                      isSelected
                        ? "bg-nb-black text-nb-white shadow-none translate-x-[4px] translate-y-[4px]"
                        : "bg-nb-white text-nb-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]"
                    }`}
                >
                  <span className="font-heading font-black text-[8px] sm:text-[10px] uppercase tracking-wider opacity-60">
                    {weekday}
                  </span>
                  <span className="font-heading font-black text-xl sm:text-2xl leading-none">
                    {day}
                  </span>
                  <span className="font-heading font-black text-[8px] sm:text-[10px] uppercase tracking-wider opacity-60">
                    {month}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2: Categories */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-nb-black text-nb-white font-heading font-black text-base sm:text-lg border-[3px] border-nb-black shadow-[3px_3px_0px_#FF5733]">
              2
            </span>
            <h2 className="font-heading font-black text-xl sm:text-2xl md:text-3xl uppercase">
              Choose Categories
            </h2>
          </div>
          <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
            <button
              onClick={selectAll}
              className="font-heading font-black text-[10px] sm:text-xs uppercase px-3 sm:px-4 py-1.5 sm:py-2 bg-nb-white border-[2.5px] border-nb-black shadow-[3px_3px_0px_#000] hover:shadow-[1.5px_1.5px_0px_#000] hover:translate-x-[1.5px] hover:translate-y-[1.5px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150 cursor-pointer"
            >
              Select All
            </button>
            <button
              onClick={clearAll}
              className="font-heading font-black text-[10px] sm:text-xs uppercase px-3 sm:px-4 py-1.5 sm:py-2 bg-nb-white border-[2.5px] border-nb-black shadow-[3px_3px_0px_#000] hover:shadow-[1.5px_1.5px_0px_#000] hover:translate-x-[1.5px] hover:translate-y-[1.5px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150 cursor-pointer"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {categories.map((cat) => {
              const isSelected = selectedCategories.has(cat.name);
              const bgColor = CATEGORY_COLORS[cat.name] || "bg-nb-white";
              return (
                <button
                  key={cat.name}
                  onClick={() => toggleCategory(cat.name)}
                  className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border-[3px] border-nb-black text-left transition-all duration-150 cursor-pointer select-none
                    ${
                      isSelected
                        ? `${bgColor} shadow-none translate-x-[4px] translate-y-[4px]`
                        : `bg-nb-white shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]`
                    }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 border-[2.5px] border-nb-black shrink-0 font-body text-xs sm:text-sm
                      ${isSelected ? "bg-nb-black text-nb-white" : "bg-nb-white"}`}
                  >
                    {isSelected ? "✓" : ""}
                  </span>
                  <span className="flex-1">
                    <span className="font-heading font-black text-xs sm:text-sm uppercase block">
                      {cat.name}
                    </span>
                  </span>
                  <span className="font-heading font-black text-[10px] sm:text-xs bg-nb-black text-nb-white px-2 py-0.5 shrink-0 ml-2">
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Explore button */}
        <section className="pb-8 sm:pb-16">
          <button
            onClick={handleExplore}
            disabled={!canExplore}
            className={`w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 font-heading font-black text-lg sm:text-xl uppercase border-[3.5px] border-nb-black transition-all duration-150 cursor-pointer
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-0">
          <span className="font-heading font-black text-xs sm:text-sm uppercase">
            SXSW 2026 Sessions Explorer
          </span>
          <a href="https://sw3ll.ai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-body text-xs text-nb-white/60 hover:text-nb-white transition-colors duration-150">
            made by
            <img src="/sw3ll-logo.png" alt="sw3ll" className="h-4 sm:h-5 opacity-60 hover:opacity-100 transition-opacity duration-150" />
          </a>
        </div>
      </footer>
    </div>
  );
}
