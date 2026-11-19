/**
 * Base error class for all amharic-number-words errors.
 */
export class AmharicNumberError extends Error {
  readonly code: string;

  constructor(message: string, code = "AMHARIC_NUMBER_ERROR") {
    super(message);
    this.name = "AmharicNumberError";
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when an input cannot be parsed as a valid numeric value.
 */
export class InvalidNumberError extends AmharicNumberError {
  constructor(message: string, details?: unknown) {
    super(message, "INVALID_NUMBER");
    this.name = "InvalidNumberError";
    if (details !== undefined) {
      (this as Record<string, unknown>).details = details;
    }
  }
}

/**
 * Thrown when a number exceeds the maximum supported magnitude or precision.
 */
export class NumberOutOfRangeError extends AmharicNumberError {
  constructor(message: string) {
    super(message, "NUMBER_OUT_OF_RANGE");
    this.name = "NumberOutOfRangeError";
  }
}

/**
 * Thrown when an unknown currency code is requested.
 */
export class UnsupportedCurrencyError extends AmharicNumberError {
  readonly currencyCode: string;

  constructor(currencyCode: string) {
    super(
      `Unsupported currency "${currencyCode}". Register it first via registerCurrency().`,
      "UNSUPPORTED_CURRENCY"
    );
    this.name = "UnsupportedCurrencyError";
    this.currencyCode = currencyCode;
  }
}

/**
 * Thrown when invalid configuration or options are provided.
 */
export class ConfigurationError extends AmharicNumberError {
  constructor(message: string) {
    super(message, "CONFIGURATION_ERROR");
    this.name = "ConfigurationError";
  }
}
