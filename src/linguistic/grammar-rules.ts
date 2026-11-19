import type { NumberToWordsOptions } from "../types/conversion.js";
import {
  getUnitWord,
  getTeenWord,
  getTenMultipleWord,
} from "./number-words.js";

/**
 * Converts a 1- or 2-digit number (0-99) into Amharic words.
 *
 * @param value integer between 0 and 99
 * @param options configuration options
 * @param isStandalone whether this number stands alone (if false and value is 0, returns "")
 */
export function convertTwoDigitNumber(
  value: number,
  options?: NumberToWordsOptions,
  isStandalone = true
): string {
  if (value === 0) {
    return isStandalone ? getUnitWord(0, options) : "";
  }

  if (value < 10) {
    return getUnitWord(value, options);
  }

  if (value < 20) {
    return getTeenWord(value, options);
  }

  const tens = Math.floor(value / 10) * 10;
  const unit = value % 10;
  const tensWord = getTenMultipleWord(tens, options);

  if (unit === 0) {
    return tensWord;
  }

  const unitWord = getUnitWord(unit, options);
  return `${tensWord} ${unitWord}`;
}

/**
 * Converts a 3-digit group (0-999) into Amharic words.
 *
 * @param value integer between 0 and 999
 * @param options configuration options
 * @param isStandalone whether this number stands alone
 */
export function convertThreeDigitGroup(
  value: number,
  options?: NumberToWordsOptions,
  isStandalone = true
): string {
  if (value === 0) {
    return isStandalone ? getUnitWord(0, options) : "";
  }

  const hundreds = Math.floor(value / 100);
  const remainder = value % 100;

  let hundredsPart = "";
  if (hundreds > 0) {
    if (hundreds === 1) {
      const leadingOne = options?.leadingOneHundred ?? true;
      hundredsPart = leadingOne ? "አንድ መቶ" : "መቶ";
    } else {
      hundredsPart = `${getUnitWord(hundreds, options)} መቶ`;
    }
  }

  const remainderPart =
    remainder > 0
      ? convertTwoDigitNumber(remainder, options, hundreds === 0 && isStandalone)
      : "";

  if (hundredsPart && remainderPart) {
    return `${hundredsPart} ${remainderPart}`;
  }

  return hundredsPart || remainderPart;
}
