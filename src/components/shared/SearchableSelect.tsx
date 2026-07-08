"use client";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export type SelectOption = {
  value: string;
  label: string;
  sublabel?: string;
};

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  emptyText = "No matches",
}: {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);
  const needle = q.trim().toLowerCase();
  const filtered = needle
    ? options.filter((o) =>
        `${o.label} ${o.sublabel ?? ""}`.toLowerCase().includes(needle),
      )
    : options;

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-[8px] border-[0.5px] border-[#B7B7B9] px-4 py-3 text-sm outline-none focus:border-primary-100 cursor-pointer"
      >
        <span className={selected ? "text-black-others truncate" : "text-[#B7B7B9]"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={18} className="shrink-0 text-black-others" />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-[8px] border border-[#EDEDED] bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-[#EDEDED] px-3 py-2">
            <Search size={15} className="text-subtle-text shrink-0" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="w-full text-sm outline-none placeholder:text-[#B7B7B9]"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-3 text-sm text-subtle-text text-center">
                {emptyText}
              </li>
            ) : (
              filtered.map((o) => {
                const active = o.value === value;
                return (
                  <li key={o.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(o.value);
                        setOpen(false);
                        setQ("");
                      }}
                      className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-primary-10 cursor-pointer ${
                        active ? "bg-primary-10" : ""
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-black-others">
                          {o.label}
                        </span>
                        {o.sublabel && (
                          <span className="block truncate text-xs text-subtle-text">
                            {o.sublabel}
                          </span>
                        )}
                      </span>
                      {active && (
                        <Check size={16} className="shrink-0 text-primary-100" />
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
