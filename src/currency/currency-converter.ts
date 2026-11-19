import type { CurrencyOptions } from "./currency-types.js";
import { validateNumberInput } from "../validation/input-validator.js";
import { roundToPrecision } from "../utils/decimal.js";
import { normalizeWhitespace, attachAmharicPreposition } from "../utils/string.js";
import {
  composeIntegerWords,
  composeSignedWords,
} from "../linguistic/composition.js";
import { getCurrency } from "./currency-registry.js";

/**
 * Converts a financial amount into Amharic currency words.
 *
 * @param value numeric amount or string
 * @param options currency and wording options
 * @returns Amharic currency expression
 *
 * @example
 * ```ts
 * currencyToAmharicWords(1500);
 * // "አንድ ሺህ አምስት መቶ ብር"
 *
 * currencyToAmharicWords(1500.5, { currency: "ETB" });
 * // "አንድ ሺህ አምስት መቶ ብር ከሃምሳ ሳንቲም"
 *
 * currencyToAmharicWords(100.25, { currency: "USD" });
 * // "አንድ መቶ ዶላር ከሃያ አምስት ሴንት"
 * ```
 */
export function currencyToAmharicWords(
  value: number | string,
  options: CurrencyOptions = {}
): string {
  const currencyDef = getCurrency(options.currency ?? "ETB");
  const parsed = validateNumberInput(value, { strict: options.strict ?? true });

  const decimals = currencyDef.decimals;
  const rounded = roundToPrecision(
    parsed.integerPart,
    parsed.fractionalPart,
    decimals
  );

  const intPart = rounded.integerPart;
  const fracPart = rounded.fractionalPart ?? "0".repeat(decimals);

  const minorInt = decimals > 0 ? parseInt(fracPart, 10) : 0;
  const isMajorZero = intPart === "0";
  const isMinorZero = minorInt === 0;

  // Major unit wording
  let majorPhrase = "";
  if (!isMajorZero || (options.showZeroMajor ?? false) || isMinorZero) {
    const intWords = composeIntegerWords(intPart, options);
    if (currencyDef.majorPlacement === "before") {
      majorPhrase = `${currencyDef.majorUnit} ${intWords}`;
    } else {
      majorPhrase = `${intWords} ${currencyDef.majorUnit}`;
    }
  }

  // Minor unit wording
  let minorPhrase = "";
  const minorFormat = options.minorFormat ?? "words";
  const zeroMinorMode = options.zeroMinorMode ?? "omit";
  const prefixPrep = options.prefixPreposition ?? true;
  const connector = currencyDef.minorConnector ?? "ከ";

  if (!isMinorZero) {
    let minorContent = "";
    if (minorFormat === "fraction") {
      const denom = Math.pow(10, decimals);
      minorContent = `${fracPart}/${denom} ${currencyDef.minorUnit}`;
    } else if (minorFormat === "digits") {
      minorContent = `${fracPart} ${currencyDef.minorUnit}`;
    } else {
      // words
      const minorWords = composeIntegerWords(minorInt.toString(), options);
      minorContent = `${minorWords} ${currencyDef.minorUnit}`;
    }

    if (majorPhrase) {
      minorPhrase = attachAmharicPreposition(connector, minorContent, prefixPrep);
    } else {
      // When major unit is not shown (e.g., 0.75 ETB), do not attach "ከ"
      minorPhrase = minorContent;
    }
  } else if (zeroMinorMode !== "omit" && decimals > 0) {
    let minorContent = "";
    if (zeroMinorMode === "fraction") {
      const denom = Math.pow(10, decimals);
      minorContent = `${"0".repeat(decimals)}/${denom} ${currencyDef.minorUnit}`;
    } else {
      // words
      minorContent = `ዜሮ ${currencyDef.minorUnit}`;
    }

    if (majorPhrase) {
      minorPhrase = attachAmharicPreposition(connector, minorContent, prefixPrep);
    } else {
      minorPhrase = minorContent;
    }
  }

  const combined = majorPhrase && minorPhrase
    ? `${majorPhrase} ${minorPhrase}`
    : majorPhrase || minorPhrase;

  const normalized = normalizeWhitespace(combined);
  return composeSignedWords(normalized, parsed.isNegative, options);
}
