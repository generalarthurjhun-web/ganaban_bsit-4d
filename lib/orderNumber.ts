const STORAGE_KEY = 'campus-cafe-order-number';
const FIRST_ORDER = '001';

export function normalizeOrderNumber(value: string | null): string {
  if (!value || !/^\d+$/.test(value)) return FIRST_ORDER;
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0
    ? String(number).padStart(3, '0')
    : FIRST_ORDER;
}

export function loadOrderNumber(): string {
  try {
    return normalizeOrderNumber(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    // The kiosk still works when browser storage is blocked or unavailable.
    return FIRST_ORDER;
  }
}

export function advanceOrderNumber(current: string): string {
  const number = Number(normalizeOrderNumber(current));
  const next = number < Number.MAX_SAFE_INTEGER ? number + 1 : 1;
  const formatted = String(next).padStart(3, '0');
  try {
    window.localStorage.setItem(STORAGE_KEY, formatted);
  } catch {
    // Persistence is optional; continue resetting the order in memory.
  }
  return formatted;
}
