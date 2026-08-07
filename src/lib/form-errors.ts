import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

/**
 * Map a backend `errors` map (`{ field: ["message", …] }`, sent on 422 validation
 * failures — see the API envelope) onto react-hook-form fields, so the message lands
 * under the offending input instead of only in a toast.
 *
 * Backend field names match our form field names for course/case payloads. A name that
 * isn't a form field is ignored by RHF rather than throwing, so an unexpected key is
 * harmless — the caller still shows the envelope `message`.
 *
 * Returns true if there was at least one field error to show.
 */
export function applyFieldErrors<T extends FieldValues>(
  fieldErrors: Record<string, string[]> | undefined,
  setError: UseFormSetError<T>,
): boolean {
  if (!fieldErrors) return false;

  let applied = false;
  for (const [field, messages] of Object.entries(fieldErrors)) {
    const message = Array.isArray(messages) ? messages[0] : messages;
    if (!message) continue;
    setError(field as Path<T>, { type: "server", message });
    applied = true;
  }
  return applied;
}
