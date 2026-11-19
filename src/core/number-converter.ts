import type { NumberToWordsOptions } from "../types/conversion.js";
import { validateNumberInput } from "../validation/input-validator.js";
import { decimalToAmharicWords } from "./decimal-converter.js";
import {
  composeIntegerWords,
  composeSignedWords,
} from "../linguistic/composition.js";
import { roundToPrecision } from "../utils/decimal.js";

/**
 * Converts a numeric value into grammatically correct Amharic words.
 *
 * Supports integers, decimals, negative numbers, numeric strings, and BigInts.
 *
 * @param value number, numeric string, or bigint
 * @param options configuration options
 * @returns grammatically correct Amharic text
 *
 * @example
 * ```ts
 * numberToAmharicWords(0);
 * // "ዜሮ"
 *
 * numberToAmharicWords(1500);
 * // "አንድ ሺህ አምስት መቶ"
 *
 * numberToAmharicWords(1250.75);
 * // "አንድ ሺህ ሁለት መቶ ሃምሳ ነጥብ ሰባት አምስት"
 *
 * numberToAmharicWords(-45);
 * // "አሉታዊ አርባ አምስት"
 * ```
 */
export function numberToAmharicWords(
  value: number | string | bigint,
  options: NumberToWordsOptions = {}
): string {
  const parsed = validateNumberInput(value, { strict: options.strict ?? true });

  // If there's no fractional part or it's all zeros
  if (
    parsed.fractionalPart === null ||
    /^0+$/.test(parsed.fractionalPart) ||
    options.decimalPrecision === 0
  ) {
    if (options.decimalPrecision === 0 && parsed.fractionalPart !== null) {
      // If decimalPrecision is 0, round according to precision
      const rounded = roundToPrecision(
        parsed.integerPart,
        parsed.fractionalPart,
        0
      );
      const words = composeIntegerWords(rounded.integerPart, options);
      return composeSignedWords(words, parsed.isNegative, options);
    }
    const words = composeIntegerWords(parsed.integerPart, options);
    return composeSignedWords(words, parsed.isNegative, options);
  }

  // If input has fractional part, use decimal converter
  return decimalToAmharicWords(value as number | string, options);
}
