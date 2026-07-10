import axios from "axios";
import SpecialtyBankClient from "./SpecialtyBankClient";
import { getSpecialties } from "@/services/cases.service";
import { getCaseBankStatus } from "@/services/subscriptions.service";
import { getPaymentPlans } from "@/services/payments.service";
import type { Specialty } from "@/types/api";

async function loadSpecialties(): Promise<Specialty[]> {
  try {
    const res = await getSpecialties();
    return res.success ? res.data : [];
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(
        "[MockBankHero] failed to fetch specialties:",
        err.code,
        err.message,
      );
    } else {
      console.error("[MockBankHero] unexpected error:", err);
    }
    return [];
  }
}

/**
 * Returns the Case Bank price label to show an upsell, or `null` when the user
 * is already subscribed (or on error — fail quiet, don't nag).
 */
async function loadUpsellPrice(): Promise<string | null> {
  try {
    const [status, plans] = await Promise.all([
      getCaseBankStatus(),
      getPaymentPlans(),
    ]);
    if (status.success && status.data.active) return null; // subscribed → no upsell
    const plan = plans.success
      ? plans.data.find((p) => p.type === "case_bank")
      : undefined;
    return plan?.prices[0]?.label ?? "";
  } catch (err) {
    if (!axios.isAxiosError(err)) throw err;
    console.error("[MockBankHero] upsell check error:", err.code, err.message);
    return null;
  }
}

export default async function MockBankHero() {
  const [specialties, upsellPriceLabel] = await Promise.all([
    loadSpecialties(),
    loadUpsellPrice(),
  ]);
  return (
    <SpecialtyBankClient
      specialties={specialties}
      upsellPriceLabel={upsellPriceLabel}
    />
  );
}
