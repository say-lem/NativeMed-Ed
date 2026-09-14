import { Suspense } from "react";
import axios from "axios";
import AdminCasebankHero from "./_components/AdminCasebankHero";
import AdminCases from "./_components/AdminCases";
import CaseBankOverviewEditor from "./_components/CaseBankOverviewEditor";
import CasesSkeleton from "./_components/CasesSkeleton";
import { getAdminCaseBankOverview, getAllAdminCases } from "@/services/cases.service";
import { AdminListProvider } from "../_components/AdminListContext";
import type { AdminCase, CaseBankOverview } from "@/types/api";

const DEFAULT_OVERVIEW: CaseBankOverview = {
  _id: "",
  title: "Case Bank Access",
  description: "Unlimited access to all mock clinical cases.",
  createdAt: "",
  updatedAt: "",
};

async function loadCases(): Promise<AdminCase[]> {
  try {
    return await getAllAdminCases();
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[admin-casebank] fetch error:", err.code, err.message);
    return [];
  }
}

async function loadOverview(): Promise<CaseBankOverview> {
  try {
    const res = await getAdminCaseBankOverview();
    return res.success ? res.data : DEFAULT_OVERVIEW;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[admin-casebank] overview fetch error:", err.code, err.message);
    return DEFAULT_OVERVIEW;
  }
}

async function CasesData() {
  const cases = await loadCases();
  return <AdminCases cases={cases} />;
}

export default async function AdminCaseBankPage() {
  const overview = await loadOverview();
  return (
    <AdminListProvider>
      <AdminCasebankHero />
      <div className="px-4 sm:px-6 lg:px-10 mt-6">
        <CaseBankOverviewEditor overview={overview} />
      </div>
      <Suspense fallback={<CasesSkeleton />}>
        <CasesData />
      </Suspense>
    </AdminListProvider>
  );
}
