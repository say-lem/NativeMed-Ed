import axios from "axios";
import SpecialtyBankClient from "@/app/(marketplace)/full-cases/_components/SpecialtyBankClient";
import CaseBankNotice from "./_components/CaseBankNotice";
import { getSpecialties } from "@/services/cases.service";
import { getCaseBankStatus } from "@/services/subscriptions.service";
import { getPaymentPlans } from "@/services/payments.service";
import { getOptionalUser } from "@/lib/current-user";
import type { Specialty } from "@/types/api";

async function loadSpecialties(): Promise<Specialty[]> {
  try {
    const res = await getSpecialties();
    return res.success ? res.data : [];
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("[free-cases] failed to fetch specialties:", err.code, err.message);
    } else {
      console.error("[free-cases] unexpected error:", err);
    }
    return [];
  }
}

/** Public/preview page — an anonymous visitor is never subscribed; a logged-in one
 *  might be, so their Case Bank status is checked (never throws for a missing sub). */
async function loadAccess(isLoggedIn: boolean): Promise<boolean> {
  if (!isLoggedIn) return false;
  try {
    const res = await getCaseBankStatus();
    return res.success && res.data.active;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[free-cases] case-bank status error:", err.code, err.message);
    return false;
  }
}

async function loadPriceLabel(): Promise<string | undefined> {
  try {
    const res = await getPaymentPlans();
    if (!res.success) return undefined;
    const plan = res.data.find((p) => p.type === "case_bank");
    return plan?.prices[0]?.label;
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    return undefined;
  }
}

export default async function FreeCasesPage() {
  const user = await getOptionalUser();
  const isLoggedIn = Boolean(user);

  const [specialties, hasAccess, priceLabel] = await Promise.all([
    loadSpecialties(),
    loadAccess(isLoggedIn),
    loadPriceLabel(),
  ]);

  return (
    <SpecialtyBankClient
      specialties={specialties}
      rootPath="/free-cases"
      notice={
        <CaseBankNotice
          hasAccess={hasAccess}
          isLoggedIn={isLoggedIn}
          priceLabel={priceLabel}
        />
      }
    />
  );
}
