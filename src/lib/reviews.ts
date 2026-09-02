const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** "03/26" -> "March 2026". Falls back to the raw value if it's not MM/YY. */
export function formatDatePassed(datePassed: string): string {
  const match = /^(\d{2})\/(\d{2})$/.exec(datePassed);
  if (!match) return datePassed;
  const month = MONTHS[Number(match[1]) - 1];
  if (!month) return datePassed;
  return `${month} 20${match[2]}`;
}

/** Strips everything but digits and "/" as the user types the MM/YY date. */
export function sanitizeDatePassedInput(value: string): string {
  return value.replace(/[^0-9/]/g, "");
}
