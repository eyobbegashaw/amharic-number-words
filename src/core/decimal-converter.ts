import type { DecimalOptions } from "../types/conversion.js";
import { validateNumberInput } from "../validation/input-validator.js";
import { roundToPrecision } from "../utils/decimal.js";
import { getUnitWord } from "../linguistic/number-words.js";
import {
  composeIntegerWords,
  composeSignedWords,
} from "../linguistic/composition.js";

/**
 * Converts fractional digits into Amharic words based on the chosen decimalMode.
 */
export function convertFractionalPart(
  fractionalPart: string,
  options?: DecimalOptions
): string {
  const mode = options?.decimalMode ?? "digits";

  if (mode === "digits") {
    const digitWords: string[] = [];
    for (const char of fractionalPart) {
      const digit = parseInt(char, 10);
      digitWords.push(getUnitWord(digit, options));
    }
    return digitWords.join(" ");
  }

  // mode === "number":
  // Handle leading zeros so that e.g. .05 is "ዜሮ አምስት" rather than just "አምስት"
  const leadingZerosMatch = fractionalPart.match(/^0+/);
  const leadingZeroCount = leadingZerosMatch ? leadingZerosMatch[0].length : 0;
  const nonZeroFraction = fractionalPart.slice(leadingZeroCount);

  const words: string[] = [];
  if (leadingZeroCount > 0 && nonZeroFraction.length > 0) {
    for (let i = 0; i < leadingZeroCount; i++) {
      words.push("ዜሮ");
    }
    words.push(composeIntegerWords(nonZeroFraction, options));
  } else if (nonZeroFraction.length === 0) {
    // All zeros, e.g. ".00"
    for (let i = 0; i < fractionalPart.length; i++) {
      words.push("ዜሮ");
    }
  } else {
    words.push(composeIntegerWords(nonZeroFraction, options));
  }

  return words.join(" ");
}

/**
 * Converts a decimal value into Amharic words.
 *
 * @param value numeric value or decimal string
 * @param options configuration options
 * @returns Amharic text representation
 *
 * @example
 * ```ts
 * decimalToAmharicWords(1250.75);
 * // "አንድ ሺህ ሁለት መቶ ሃምሳ ነጥብ ሰባት አምስት"
 *
 * decimalToAmharicWords(1250.75, { decimalMode: "number" });
 * // "አንድ ሺህ ሁለት መቶ ሃምሳ ነጥብ ሰባ አምስት"
 *
 * decimalToAmharicWords(0.75, { includeIntegerPart: false });
 * // "ሰባት አምስት"
 * ```
 */
export function decimalToAmharicWords(
  value: number | string,
  options: DecimalOptions = {}
): string {
  const parsed = validateNumberInput(value, { strict: options.strict ?? true });

  let intPart = parsed.integerPart;
  let fracPart = parsed.fractionalPart;

  if (options.decimalPrecision !== undefined) {
    const rounded = roundToPrecision(intPart, fracPart, options.decimalPrecision);
    intPart = rounded.integerPart;
    fracPart = rounded.fractionalPart;
  }

  const pointWord = options.decimalPointWord ?? "ነጥብ";
  const includeInt = options.includeIntegerPart ?? true;

  if (fracPart === null || fracPart.length === 0) {
    if (!includeInt) {
      return "";
    }
    const intWords = composeIntegerWords(intPart, options);
    return composeSignedWords(intWords, parsed.isNegative, options);
  }

  const fracWords = convertFractionalPart(fracPart, options);

  if (!includeInt) {
    return fracWords;
  }

  const intWords = composeIntegerWords(intPart, options);
  const fullText = `${intWords} ${pointWord} ${fracWords}`;

  return composeSignedWords(fullText, parsed.isNegative, options);
}
