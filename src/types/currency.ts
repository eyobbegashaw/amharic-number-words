import type { NumberToWordsOptions } from "./conversion.js";

/**
 * Definition of a currency's linguistic properties in Amharic.
 */
export interface CurrencyDefinition {
  /**
   * ISO 4217 currency code or unique identifier (e.g., "ETB", "USD").
   */
  code: string;

  /**
   * Name of the major currency unit in Amharic (e.g., "ብር" for ETB, "ዶላር" for USD).
   */
  majorUnit: string;

  /**
   * Name of the minor currency unit in Amharic (e.g., "ሳንቲም" for ETB, "ሴንት" for USD).
   */
  minorUnit: string;

  /**
   * Number of decimal fractional digits (e.g., 2 for cents/santim, 0 for zero-decimal currencies).
   * @default 2
   */
  decimals: number;

  /**
   * Preposition or connector linking major and minor units.
   * In Amharic, "ከ" is standard (meaning "and / with / from").
   * @default "ከ"
   */
  minorConnector?: string;

  /**
   * Optional distinct singular form for the major unit (if different).
   */
  singularMajorUnit?: string;

  /**
   * Optional distinct singular form for the minor unit (if different).
   */
  singularMinorUnit?: string;

  /**
   * Placement of the major unit relative to the amount words.
   * In Amharic, the unit typically follows the number (e.g., "አምስት መቶ ብር").
   * @default "after"
   */
  majorPlacement?: "before" | "after";
}

/**
 * How to format the minor unit (e.g. cents / santim):
 * - "words": convert to Amharic words (e.g. "ከሃምሳ ሳንቲም").
 * - "fraction": format as a 2-digit fraction over denominator (e.g. "ከ 50/100 ሳንቲም").
 * - "digits": format as numeric digits (e.g. "ከ 50 ሳንቲም").
 */
export type MinorFormat = "words" | "fraction" | "digits";

/**
 * Behavior when the fractional/minor unit is zero:
 * - "omit": do not output the minor unit (e.g. "አንድ ሺህ አምስት መቶ ብር").
 * - "words": spell out zero (e.g. "ከዜሮ ሳንቲም").
 * - "fraction": format as zero fraction (e.g. "ከ 00/100 ሳንቲም").
 */
export type ZeroMinorMode = "omit" | "words" | "fraction";

/**
 * Options for currency amount conversion.
 */
export interface CurrencyOptions extends NumberToWordsOptions {
  /**
   * Currency identifier (e.g., "ETB", "USD") or a custom CurrencyDefinition object.
   * @default "ETB"
   */
  currency?: string | CurrencyDefinition;

  /**
   * Format of the minor currency unit.
   * @default "words"
   */
  minorFormat?: MinorFormat;

  /**
   * How to handle zero minor amounts (e.g. .00).
   * @default "omit"
   */
  zeroMinorMode?: ZeroMinorMode;

  /**
   * Whether to include the major unit when the major amount is zero.
   * If false, 0.75 ETB yields "ሰባ አምስት ሳንቲም".
   * If true, yields "ዜሮ ብር ከሰባ አምስት ሳንቲም".
   * @default false
   */
  showZeroMajor?: boolean;

  /**
   * Whether to attach the proclitic preposition "ከ" directly to the following word
   * (e.g. "ከሃምሳ", "ከአስር") in accordance with classical Amharic grammar,
   * or keep a space between them ("ከ ሃምሳ").
   * @default true
   */
  prefixPreposition?: boolean;
}

/**
 * Options for cheque amount wording.
 */
export interface ChequeOptions extends CurrencyOptions {
  /**
   * Closing suffix word or phrase for cheques to prevent alteration.
   * In Ethiopia, "ብቻ" (Only) is universally used.
   * Set to an empty string to omit.
   * @default "ብቻ"
   */
  closingPhrase?: string;

  /**
   * Optional prefix phrase before the cheque amount.
   */
  prefixPhrase?: string;
}

/**
 * Presentation style for financial formatting.
 */
export type FormatStyle = "plain" | "currency" | "cheque" | "receipt" | "invoice";

/**
 * Options for formatting amounts across different business styles.
 */
export interface FormatAmountOptions extends ChequeOptions {
  /**
   * Presentation style:
   * - "plain": core number in words (no currency)
   * - "currency": number with currency units
   * - "cheque": cheque format with security closing phrase ("ብቻ")
   * - "receipt": receipt format with receipt label
   * - "invoice": invoice total format with invoice label
   * @default "plain"
   */
  style?: FormatStyle;

  /**
   * Custom label to prepend (e.g. "ጠቅላላ ክፍያ፡" or "ድምር፡").
   * Used in "receipt" and "invoice" styles if provided.
   */
  customLabel?: string;
}
