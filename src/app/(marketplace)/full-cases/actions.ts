"use server";
import { runCheckout, type CheckoutActionResult } from "@/lib/checkout";

// See the note in courses/[id]/actions.ts — no type re-exports from a "use server" file.

/** Kick off Stripe checkout for the Case Bank subscription (unlocks all cases). */
export async function startCaseBankCheckout(
  interval = "monthly",
): Promise<CheckoutActionResult> {
  return runCheckout(
    { type: "case_bank", interval },
    "payments/checkout case_bank",
  );
}
