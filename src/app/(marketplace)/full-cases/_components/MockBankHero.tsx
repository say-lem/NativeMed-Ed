import axios from "axios";
import SpecialtyBankClient from "./SpecialtyBankClient";
import { getSpecialties } from "@/services/cases.service";
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

export default async function MockBankHero() {
  const specialties = await loadSpecialties();
  return <SpecialtyBankClient specialties={specialties} />;
}
