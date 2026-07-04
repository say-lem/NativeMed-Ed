"use client";

import { createContext, useContext, useState } from "react";

type AdminListValue = {
  query: string;
  /** Setting the query resets pagination to page 1. */
  setQuery: (q: string) => void;
  page: number;
  setPage: (p: number) => void;
};

const AdminListContext = createContext<AdminListValue | null>(null);

export function AdminListProvider({ children }: { children: React.ReactNode }) {
  const [query, setQueryState] = useState("");
  const [page, setPage] = useState(1);

  const setQuery = (q: string) => {
    setQueryState(q);
    setPage(1);
  };

  return (
    <AdminListContext.Provider value={{ query, setQuery, page, setPage }}>
      {children}
    </AdminListContext.Provider>
  );
}

export function useAdminList(): AdminListValue {
  const ctx = useContext(AdminListContext);
  if (!ctx) {
    throw new Error("useAdminList must be used within an AdminListProvider");
  }
  return ctx;
}
