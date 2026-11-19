/**
 * Spelling variation for the number 3 ("ሦስት" traditional vs "ሶስት" modern).
 */
type SostSpelling = "ሦስት" | "ሶስት";
/**
 * Spelling variation for the number 10 ("አስር" modern vs "ዐስር" traditional).
 */
type AsirSpelling = "አስር" | "ዐስር";
/**
 * Spelling variation for the number 50 ("ሃምሳ" standard vs "አምሳ" colloquial).
 */
type HamsaSpelling = "ሃምሳ" | "አምሳ";
/**
 * Spelling variation for 1,000 ("ሺህ" formal vs "ሺ" informal).
 */
type ShihSpelling = "ሺህ" | "ሺ";
/**
 * Mode for interpreting decimal fractions in non-currency contexts:
 * - "digits": reads each fractional digit individually (e.g. 0.75 -> "ሰባት አምስት", 0.05 -> "ዜሮ አምስት").
 * - "number": reads the fractional part as a whole number (e.g. 0.75 -> "ሰባ አምስት").
 */
type DecimalMode = "digits" | "number";
/**
 * Prefix to use for negative numbers.
 * Common choices:
 * - "አሉታዊ" (formal Amharic, default)
 * - "ኔጌቲቭ" (widely spoken / colloquial)
 * - "ሲቀነስ" (subtracted / minus)
 */
type NegativePrefix = "አሉታዊ" | "ኔጌቲቭ" | "ሲቀነስ" | (string & {});
/**
 * Options for converting numbers to Amharic words.
 */
interface NumberToWordsOptions {
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
interface IntegerOptions extends Omit<NumberToWordsOptions, "decimalMode" | "decimalPointWord" | "decimalPrecision"> {
    /**
     * If true, throws if the input has a non-zero decimal part.
     * @default true
     */
    strictInteger?: boolean;
}
/**
 * Options for decimal conversion.
 */
interface DecimalOptions extends NumberToWordsOptions {
    /**
     * Whether to include the integer part or only convert the decimal fraction.
     * @default true
     */
    includeIntegerPart?: boolean;
}
/**
 * Internal parsed representation of a numeric input.
 */
interface ParsedNumber {
    isNegative: boolean;
    integerPart: string;
    fractionalPart: string | null;
    originalInput: number | string | bigint;
}

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
declare function numberToAmharicWords(value: number | string | bigint, options?: NumberToWordsOptions): string;

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
declare function integerToAmharicWords(value: number | string | bigint, options?: IntegerOptions): string;

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
declare function decimalToAmharicWords(value: number | string, options?: DecimalOptions): string;

/**
 * Definition of a currency's linguistic properties in Amharic.
 */
interface CurrencyDefinition {
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
type MinorFormat = "words" | "fraction" | "digits";
/**
 * Behavior when the fractional/minor unit is zero:
 * - "omit": do not output the minor unit (e.g. "አንድ ሺህ አምስት መቶ ብር").
 * - "words": spell out zero (e.g. "ከዜሮ ሳንቲም").
 * - "fraction": format as zero fraction (e.g. "ከ 00/100 ሳንቲም").
 */
type ZeroMinorMode = "omit" | "words" | "fraction";
/**
 * Options for currency amount conversion.
 */
interface CurrencyOptions extends NumberToWordsOptions {
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
interface ChequeOptions extends CurrencyOptions {
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
type FormatStyle = "plain" | "currency" | "cheque" | "receipt" | "invoice";
/**
 * Options for formatting amounts across different business styles.
 */
interface FormatAmountOptions extends ChequeOptions {
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
declare function currencyToAmharicWords(value: number | string, options?: CurrencyOptions): string;

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
declare function toChequeWords(value: number | string, options?: ChequeOptions): string;

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
declare function amountToAmharicWords(value: number | string | bigint, options?: (NumberToWordsOptions & {
    currency?: string;
})): string;
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
declare function formatAmountInAmharic(value: number | string, options?: FormatAmountOptions): string;

/**
 * Registers or overrides a currency definition.
 *
 * @param currency custom CurrencyDefinition
 */
declare function registerCurrency(currency: CurrencyDefinition): void;
/**
 * Checks whether a currency code is registered.
 */
declare function hasCurrency(code: string): boolean;
/**
 * Retrieves a currency definition by code or returns the definition directly if already an object.
 * Throws UnsupportedCurrencyError if not found.
 */
declare function getCurrency(codeOrDefinition: string | CurrencyDefinition): CurrencyDefinition;
/**
 * Resets the registry back to its default currencies (ETB, USD, EUR, GBP).
 */
declare function resetCurrencyRegistry(): void;

/**
 * Ethiopian Birr (ETB) definition.
 * Major unit: ብር (Birr)
 * Minor unit: ሳንቲም (Santim)
 */
declare const ETB_CURRENCY: CurrencyDefinition;

/**
 * United States Dollar (USD) definition in Amharic.
 * Major unit: ዶላር (Dollar)
 * Minor unit: ሴንት (Cent)
 */
declare const USD_CURRENCY: CurrencyDefinition;

/**
 * Euro (EUR) definition in Amharic.
 * Major unit: ዩሮ (Euro)
 * Minor unit: ሴንት (Cent)
 */
declare const EUR_CURRENCY: CurrencyDefinition;
/**
 * British Pound (GBP) definition in Amharic.
 * Major unit: ፓውንድ (Pound)
 * Minor unit: ፔንስ (Pence)
 */
declare const GBP_CURRENCY: CurrencyDefinition;

/**
 * Checks whether an input is a valid, parseable numeric value supported by the converter.
 *
 * Supports:
 * - JavaScript `number` (excluding `NaN`, `Infinity`, `-Infinity`)
 * - JavaScript `bigint`
 * - Clean or formatted numeric `string` (e.g., "1500", " 1,250.75 ", "-42.5")
 */
declare function isSupportedNumber(value: unknown): boolean;
/**
 * Validates and safely parses an input value into a ParsedNumber object.
 * Throws InvalidNumberError or NumberOutOfRangeError if validation fails.
 */
declare function validateNumberInput(value: unknown, options?: {
    strict?: boolean;
}): ParsedNumber;

/**
 * Base error class for all amharic-number-words errors.
 */
declare class AmharicNumberError extends Error {
    readonly code: string;
    constructor(message: string, code?: string);
}
/**
 * Thrown when an input cannot be parsed as a valid numeric value.
 */
declare class InvalidNumberError extends AmharicNumberError {
    constructor(message: string, details?: unknown);
}
/**
 * Thrown when a number exceeds the maximum supported magnitude or precision.
 */
declare class NumberOutOfRangeError extends AmharicNumberError {
    constructor(message: string);
}
/**
 * Thrown when an unknown currency code is requested.
 */
declare class UnsupportedCurrencyError extends AmharicNumberError {
    readonly currencyCode: string;
    constructor(currencyCode: string);
}
/**
 * Thrown when invalid configuration or options are provided.
 */
declare class ConfigurationError extends AmharicNumberError {
    constructor(message: string);
}

declare const DEFAULT_NUMBER_OPTIONS: Required<Omit<NumberToWordsOptions, "decimalPrecision">>;
declare const DEFAULT_CURRENCY_OPTIONS: Required<Omit<CurrencyOptions, "currency" | "decimalPrecision">>;
declare const DEFAULT_CHEQUE_OPTIONS: Required<Omit<ChequeOptions, "currency" | "decimalPrecision" | "prefixPhrase">>;

export { AmharicNumberError, type AsirSpelling, type ChequeOptions, ConfigurationError, type CurrencyDefinition, type CurrencyOptions, DEFAULT_CHEQUE_OPTIONS, DEFAULT_CURRENCY_OPTIONS, DEFAULT_NUMBER_OPTIONS, type DecimalMode, type DecimalOptions, ETB_CURRENCY, EUR_CURRENCY, type FormatAmountOptions, type FormatStyle, GBP_CURRENCY, type HamsaSpelling, type IntegerOptions, InvalidNumberError, type MinorFormat, type NegativePrefix, NumberOutOfRangeError, type NumberToWordsOptions, type ParsedNumber, type ShihSpelling, type SostSpelling, USD_CURRENCY, UnsupportedCurrencyError, type ZeroMinorMode, amountToAmharicWords, currencyToAmharicWords, decimalToAmharicWords, formatAmountInAmharic, getCurrency, hasCurrency, integerToAmharicWords, isSupportedNumber, numberToAmharicWords, registerCurrency, resetCurrencyRegistry, toChequeWords, validateNumberInput };
