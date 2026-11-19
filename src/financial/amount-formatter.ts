import type { FormatAmountOptions } from "../types/currency.js";
import type { NumberToWordsOptions } from "../types/conversion.js";
import { numberToAmharicWords } from "../core/number-converter.js";
import { currencyToAmharicWords } from "../currency/currency-converter.js";
import { toChequeWords } from "./cheque.js";
import { normalizeWhitespace } from "../utils/string.js";

/**
 * Converts a financial amount into Amharic words.
 *
 * If no currency is specified, outputs the plain number words.
 * If currency is specified, outputs the amount with currency units.
 *
 * @param value numeric value, string, or bigint
 * @param options conversion options
 *
 * @example
 * ```ts
 * amountToAmharicWords(1500);
 * // "አንድ ሺህ አምስት መቶ"
 *
 * amountToAmharicWords(1500, { currency: "ETB" });
 * // "አንድ ሺህ አምስት መቶ ብር"
 * ```
 */
export function amountToAmharicWords(
  value: number | string | bigint,
  options: (NumberToWordsOptions & { currency?: string }) = {}
): string {
  if (options.currency) {
    return currencyToAmharicWords(value as number | string, options);
  }
  return numberToAmharicWords(value, options);
}

/**
 * Formats a financial amount according to predefined business application styles:
 * - "plain": core number in words (e.g. "አንድ ሺህ አምስት መቶ")
 * - "currency": with currency units (e.g. "አንድ ሺህ አምስት መቶ ብር")
 * - "cheque": formal cheque format (e.g. "አንድ ሺህ አምስት መቶ ብር ብቻ")
 * - "receipt": POS/receipt format (e.g. "የተከፈለ መጠን፡ አንድ ሺህ አምስት መቶ ብር")
 * - "invoice": invoice total format (e.g. "ጠቅላላ ድምር፡ አንድ ሺህ አምስት መቶ ብር")
 *
 * @param value numeric value or string
 * @param options formatting style and options
 *
 * @example
 * ```ts
 * formatAmountInAmharic(1500, { currency: "ETB", style: "receipt" });
 * // "የተከፈለ መጠን፡ አንድ ሺህ አምስት መቶ ብር"
 *
 * formatAmountInAmharic(1500, { currency: "ETB", style: "invoice" });
 * // "ጠቅላላ ድምር፡ አንድ ሺህ አምስት መቶ ብር"
 * ```
 */
export function formatAmountInAmharic(
  value: number | string,
  options: FormatAmountOptions = {}
): string {
  const style = options.style ?? "plain";

  switch (style) {
    case "plain":
      return numberToAmharicWords(value, options);

    case "cheque":
      return toChequeWords(value, options);

    case "currency":
      return currencyToAmharicWords(value, options);

    case "receipt": {
      const label = options.customLabel ?? "የተከፈለ መጠን፡";
      const words = currencyToAmharicWords(value, options);
      return normalizeWhitespace(`${label} ${words}`);
    }

    case "invoice": {
      const label = options.customLabel ?? "ጠቅላላ ድምር፡";
      const words = currencyToAmharicWords(value, options);
      return normalizeWhitespace(`${label} ${words}`);
    }

    default:
      return currencyToAmharicWords(value, options);
  }
}
