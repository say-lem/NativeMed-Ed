"use client";

import { useState } from "react";
import NamedHeader from "@/components/shared/header/NamedHeader";
import SideNav from "./_components/SideNav";
import { Menu, X } from "lucide-react";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="flex relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — always visible on lg+, slide-out drawer on smaller */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 bg-white w-[70vw] sm:w-[50vw] md:w-[40vw]
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:w-auto lg:basis-[24vw]
          pt-4 min-h-screen pr-4 pb-10
        `}
      >
        {/* Close button inside drawer on mobile */}
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
          {/* Hamburger on mobile */}
          <button
            className="lg:hidden text-black"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
          <div className="ml-auto">
            <NamedHeader />
          </div>
        </div>

        {children}
      </aside>
    </main>
  );
}
