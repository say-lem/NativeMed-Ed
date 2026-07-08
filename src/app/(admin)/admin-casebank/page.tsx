import { Suspense } from "react";
import axios from "axios";
import AdminCasebankHero from "./_components/AdminCasebankHero";
import AdminCases from "./_components/AdminCases";
import CasesSkeleton from "./_components/CasesSkeleton";
import { getAdminCases } from "@/services/cases.service";
import { AdminListProvider } from "../_components/AdminListContext";
import type { AdminCase } from "@/types/api";

async function loadCases(): Promise<AdminCase[]> {
  try {
    const res = await getAdminCases();
    return res.success ? res.data.items : [];
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
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
