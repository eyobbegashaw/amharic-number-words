import type { ChequeOptions } from "../types/currency.js";
import { currencyToAmharicWords } from "../currency/currency-converter.js";
import { normalizeWhitespace } from "../utils/string.js";

/**
 * Converts a financial amount into standard Amharic cheque wording.
 *
 * Appends the standard Ethiopian cheque closing suffix "ብቻ" (Only) to prevent fraud.
 *
 * @param value numeric value or string
 * @param options cheque formatting options
 * @returns formal Amharic cheque wording
 *
 * @example
 * ```ts
 * toChequeWords(1500);
 * // "አንድ ሺህ አምስት መቶ ብር ብቻ"
 *
 * toChequeWords(1540.5);
 * // "አንድ ሺህ አምስት መቶ አርባ ብር ከሃምሳ ሳንቲም ብቻ"
 *
 * toChequeWords(1500, { zeroMinorMode: "fraction" });
 * // "አንድ ሺህ አምስት መቶ ብር ከ 00/100 ሳንቲም ብቻ"
 * ```
 */
export function toChequeWords(
  value: number | string,
  options: ChequeOptions = {}
): string {
  const currencyWords = currencyToAmharicWords(value, {
    currency: "ETB",
    ...options,
  });

  const closing = options.closingPhrase ?? "ብቻ";
  const prefix = options.prefixPhrase?.trim();

  let result = currencyWords;
  if (prefix) {
    result = `${prefix} ${result}`;
  }
  if (closing.trim()) {
    result = `${result} ${closing.trim()}`;
  }

  return normalizeWhitespace(result);
}
