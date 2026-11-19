import type { NumberToWordsOptions } from "../types/conversion.js";
import { NumberOutOfRangeError } from "../validation/errors.js";
import { convertThreeDigitGroup } from "./grammar-rules.js";
import { getScaleWord, SCALE_NAMES } from "./number-words.js";

export interface TripletGroup {
  index: number; // 0 for units, 1 for thousands, 2 for millions, etc.
  value: number; // 0 to 999
  rawString: string;
}

/**
 * Splits a normalized integer string into 3-digit triplet groups from right to left.
 *
 * Example: "2500000" ->
 * [
 *   { index: 0, value: 0, rawString: "000" },
 *   { index: 1, value: 500, rawString: "500" },
 *   { index: 2, value: 2, rawString: "2" }
 * ]
 */
export function decomposeIntegerToGroups(integerString: string): TripletGroup[] {
  const groups: TripletGroup[] = [];
  const len = integerString.length;
  let scaleIndex = 0;

  for (let i = len; i > 0; i -= 3) {
    const start = Math.max(0, i - 3);
    const chunk = integerString.slice(start, i);
    const value = parseInt(chunk, 10);

    groups.push({
      index: scaleIndex,
      value,
      rawString: chunk,
    });

    scaleIndex++;
  }

  return groups;
}

/**
 * Formats a single scale group with its scale word.
 */
export function formatScaleGroup(
  group: TripletGroup,
  options?: NumberToWordsOptions
): string {
  if (group.value === 0) {
    return "";
  }

  const { index, value } = group;

  if (index >= SCALE_NAMES.length) {
    throw new NumberOutOfRangeError(
      `Number scale ${index * 3} exceeds maximum supported scale (${(SCALE_NAMES.length - 1) * 3}).`
    );
  }

  // Unit group (10^0) has no scale word
  if (index === 0) {
    return convertThreeDigitGroup(value, options, false);
  }

  const scaleWord = getScaleWord(index, options);

  // Special handling when value is 1:
  // - Thousands (index 1): "አንድ ሺህ" if leadingOneThousand is true, else "ሺህ"
  // - Millions and higher (index >= 2): Always "አንድ <scale>" (e.g. "አንድ ሚሊዮን", "አንድ ቢሊዮን")
  if (value === 1) {
    if (index === 1) {
      const leadingOne = options?.leadingOneThousand ?? true;
      return leadingOne ? `አንድ ${scaleWord}` : scaleWord;
    }
    return `አንድ ${scaleWord}`;
  }

  const groupWords = convertThreeDigitGroup(value, options, false);
  return `${groupWords} ${scaleWord}`;
}
