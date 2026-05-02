/**
 * Asynchronous sleep utility.
 * @example await sleep(1000); // wait 1 second
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Remove undefined keys from an object (useful for Prisma updates).
 */
export function omitUndefined<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

/**
 * Check if a value is a plain object.
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
