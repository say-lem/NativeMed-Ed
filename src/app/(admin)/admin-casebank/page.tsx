import { Suspense } from "react";
import axios from "axios";
import AdminCasebankHero from "./_components/AdminCasebankHero";
import AdminCases from "./_components/AdminCases";
import CasesSkeleton from "./_components/CasesSkeleton";
import { getAllAdminCases } from "@/services/cases.service";
import { AdminListProvider } from "../_components/AdminListContext";
import type { AdminCase } from "@/types/api";

async function loadCases(): Promise<AdminCase[]> {
  try {
    return await getAllAdminCases();
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[admin-casebank] fetch error:", err.code, err.message);
    return [];
  }
}

async function CasesData() {
  const cases = await loadCases();
  return <AdminCases cases={cases} />;
}

export default function AdminCaseBankPage() {
  return (
    <AdminListProvider>
      <AdminCasebankHero />
      <Suspense fallback={<CasesSkeleton />}>
        <CasesData />
      </Suspense>
    </AdminListProvider>
  );
}
