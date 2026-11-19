import type { NumberToWordsOptions } from "./conversion.js";
import type { CurrencyOptions, ChequeOptions } from "./currency.js";

export const DEFAULT_NUMBER_OPTIONS: Required<
  Omit<NumberToWordsOptions, "decimalPrecision">
> = {
  sostSpelling: "ሦስት",
  asirSpelling: "አስር",
  hamsaSpelling: "ሃምሳ",
  shihSpelling: "ሺህ",
  leadingOneHundred: true,
  leadingOneThousand: true,
  decimalMode: "digits",
  decimalPointWord: "ነጥብ",
  negativePrefix: "አሉታዊ",
  strict: true,
};

export const DEFAULT_CURRENCY_OPTIONS: Required<
  Omit<CurrencyOptions, "currency" | "decimalPrecision">
> = {
  ...DEFAULT_NUMBER_OPTIONS,
  minorFormat: "words",
  zeroMinorMode: "omit",
  showZeroMajor: false,
  prefixPreposition: true,
};

export const DEFAULT_CHEQUE_OPTIONS: Required<
  Omit<ChequeOptions, "currency" | "decimalPrecision" | "prefixPhrase">
> = {
  ...DEFAULT_CURRENCY_OPTIONS,
  closingPhrase: "ብቻ",
};
