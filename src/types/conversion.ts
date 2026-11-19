/**
 * Spelling variation for the number 3 ("ሦስት" traditional vs "ሶስት" modern).
 */
export type SostSpelling = "ሦስት" | "ሶስት";

/**
 * Spelling variation for the number 10 ("አስር" modern vs "ዐስር" traditional).
 */
export type AsirSpelling = "አስር" | "ዐስር";

/**
 * Spelling variation for the number 50 ("ሃምሳ" standard vs "አምሳ" colloquial).
 */
export type HamsaSpelling = "ሃምሳ" | "አምሳ";

/**
 * Spelling variation for 1,000 ("ሺህ" formal vs "ሺ" informal).
 */
export type ShihSpelling = "ሺህ" | "ሺ";

/**
 * Mode for interpreting decimal fractions in non-currency contexts:
 * - "digits": reads each fractional digit individually (e.g. 0.75 -> "ሰባት አምስት", 0.05 -> "ዜሮ አምስት").
 * - "number": reads the fractional part as a whole number (e.g. 0.75 -> "ሰባ አምስት").
 */
export type DecimalMode = "digits" | "number";

/**
 * Prefix to use for negative numbers.
 * Common choices:
 * - "አሉታዊ" (formal Amharic, default)
 * - "ኔጌቲቭ" (widely spoken / colloquial)
 * - "ሲቀነስ" (subtracted / minus)
 */
export type NegativePrefix = "አሉታዊ" | "ኔጌቲቭ" | "ሲቀነስ" | (string & {});

/**
 * Options for converting numbers to Amharic words.
 */
export interface NumberToWordsOptions {
  /**
   * Spelling for the number 3 (and compound 13).
   * @default "ሦስት"
   */
  sostSpelling?: SostSpelling;

  /**
   * Spelling for the number 10.
   * @default "አስር"
   */
  asirSpelling?: AsirSpelling;

  /**
   * Spelling for the number 50.
   * @default "ሃምሳ"
   */
  hamsaSpelling?: HamsaSpelling;

  /**
   * Spelling for 1,000 ("ሺህ" or "ሺ").
   * @default "ሺህ"
   */
  shihSpelling?: ShihSpelling;

  /**
   * Whether to prefix "አንድ" before 100 (e.g., 100 -> "አንድ መቶ", 101 -> "አንድ መቶ አንድ").
   * When false: 100 -> "መቶ", 101 -> "መቶ አንድ".
   * Note: In Ethiopian business and financial systems, "አንድ መቶ" is standard to prevent tampering.
   * @default true
   */
  leadingOneHundred?: boolean;

  /**
   * Whether to prefix "አንድ" before 1,000 (e.g., 1000 -> "አንድ ሺህ", 1500 -> "አንድ ሺህ አምስት መቶ").
   * When false: 1000 -> "ሺህ".
   * @default true
   */
  leadingOneThousand?: boolean;

  /**
   * Mode for converting decimal fractions.
   * @default "digits"
   */
  decimalMode?: DecimalMode;

  /**
   * Word used for the decimal point.
   * @default "ነጥብ"
   */
  decimalPointWord?: string;

  /**
   * Maximum decimal places to consider. If provided, the fractional part is truncated or rounded.
   */
  decimalPrecision?: number;

  /**
   * Prefix for negative values.
   * @default "አሉታዊ"
   */
  negativePrefix?: NegativePrefix;

  /**
   * Whether to enforce strict input validation.
   * If true, non-numeric strings, NaN, Infinity, etc. throw an InvalidNumberError.
   * @default true
   */
  strict?: boolean;
}

/**
 * Options for integer conversion.
 */
export interface IntegerOptions
  extends Omit<NumberToWordsOptions, "decimalMode" | "decimalPointWord" | "decimalPrecision"> {
  /**
   * If true, throws if the input has a non-zero decimal part.
   * @default true
   */
  strictInteger?: boolean;
}

/**
 * Options for decimal conversion.
 */
export interface DecimalOptions extends NumberToWordsOptions {
  /**
   * Whether to include the integer part or only convert the decimal fraction.
   * @default true
   */
  includeIntegerPart?: boolean;
}

/**
 * Internal parsed representation of a numeric input.
 */
export interface ParsedNumber {
  isNegative: boolean;
  integerPart: string;
  fractionalPart: string | null;
  originalInput: number | string | bigint;
}
