import type { IntegerOptions } from "../types/conversion.js";
import { validateNumberInput } from "../validation/input-validator.js";
import { InvalidNumberError } from "../validation/errors.js";
import {
  composeIntegerWords,
  composeSignedWords,
} from "../linguistic/composition.js";

/**
 * Converts an integer into Amharic words.
 *
 * @param value integer number, numeric string, or bigint
 * @param options configuration options
 * @returns grammatically correct Amharic words
 *
 * @example
 * ```ts
 * integerToAmharicWords(1500);
 * // "አንድ ሺህ አምስት መቶ"
 *
 * integerToAmharicWords(-42);
 * // "አሉታዊ አርባ ሁለት"
 * ```
 */
export function integerToAmharicWords(
  value: number | string | bigint,
  options: IntegerOptions = {}
): string {
  const parsed = validateNumberInput(value, { strict: options.strict ?? true });

  const { strictInteger = true } = options;
  if (
    strictInteger &&
    parsed.fractionalPart !== null &&
    !/^0+$/.test(parsed.fractionalPart)
  ) {
    throw new InvalidNumberError(
      `Expected an integer, but received fractional value "${value}".`
    );
  }

  const words = composeIntegerWords(parsed.integerPart, options);
  return composeSignedWords(words, parsed.isNegative, options);
}
