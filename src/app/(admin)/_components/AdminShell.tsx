"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import AdminSideNav from "./AdminSideNav";
import type { User } from "@/types/api";
import AdminHeader from "@/components/shared/header/AdminHeader";
import BackToTop from "@/components/shared/BackToTop";
import FeedbackButton from "@/components/shared/feedback/FeedbackButton";

export default function AdminShell({
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
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:sticky lg:top-0 lg:translate-x-0 lg:w-auto lg:max-w-none lg:basis-[24vw]
          lg:h-screen lg:self-start
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
          <AdminSideNav />
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
            <AdminHeader user={user} />
          </div>
        </div>

        {children}
      </aside>

      <BackToTop />
      <FeedbackButton />
    </main>
  );
}
