// Core converters
export { numberToAmharicWords } from "./core/number-converter.js";
export { integerToAmharicWords } from "./core/integer-converter.js";
export { decimalToAmharicWords } from "./core/decimal-converter.js";

// Financial and currency converters
export { currencyToAmharicWords } from "./currency/currency-converter.js";
export { toChequeWords } from "./financial/cheque.js";
export {
  amountToAmharicWords,
  formatAmountInAmharic,
} from "./financial/amount-formatter.js";

// Currency registry and built-in definitions
export {
  registerCurrency,
  getCurrency,
  hasCurrency,
  resetCurrencyRegistry,
} from "./currency/currency-registry.js";
export { ETB_CURRENCY } from "./currency/currencies/etb.js";
export { USD_CURRENCY } from "./currency/currencies/usd.js";
export { EUR_CURRENCY, GBP_CURRENCY } from "./currency/currencies/eur.js";

// Validation and errors
export { isSupportedNumber, validateNumberInput } from "./validation/input-validator.js";
export {
  AmharicNumberError,
  InvalidNumberError,
  NumberOutOfRangeError,
  UnsupportedCurrencyError,
  ConfigurationError,
} from "./validation/errors.js";

// Types
export type {
  NumberToWordsOptions,
  IntegerOptions,
  DecimalOptions,
  DecimalMode,
  SostSpelling,
  AsirSpelling,
  HamsaSpelling,
  ShihSpelling,
  NegativePrefix,
  ParsedNumber,
} from "./types/conversion.js";

export type {
  CurrencyDefinition,
  CurrencyOptions,
  ChequeOptions,
  FormatAmountOptions,
  FormatStyle,
  MinorFormat,
  ZeroMinorMode,
} from "./types/currency.js";

export {
  DEFAULT_NUMBER_OPTIONS,
  DEFAULT_CURRENCY_OPTIONS,
  DEFAULT_CHEQUE_OPTIONS,
} from "./types/options.js";
