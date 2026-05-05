"use client";

import { useState } from "react";
import NamedHeader from "@/components/shared/header/NamedHeader";
import SideNav from "./SideNav";
import { Menu, X } from "lucide-react";
import type { User } from "@/types/api";

export default function MarketplaceShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="flex relative">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-50 bg-white w-[75vw] sm:w-[55vw] md:w-[45vw] max-w-sm md:max-w-md
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:w-auto lg:max-w-none lg:basis-[24vw]
          pt-4 min-h-screen pr-4 pb-10
        `}
      >
        <div className="flex justify-end px-4 mb-2 lg:hidden">
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>
        <div onClick={() => setSidebarOpen(false)}>
          <SideNav />
        </div>
      </aside>

      <aside className="flex-1 pt-4 sm:pt-6 lg:pt-9 space-y-4 sm:space-y-5 min-w-0 border-l-[0.5px] border-gray-2">
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-10">
          <button
            className="lg:hidden text-black"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
          <div className="ml-auto">
            <NamedHeader user={user} />
          </div>
        </div>

        {children}
      </aside>
    </main>
  );
}
