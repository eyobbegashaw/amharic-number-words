import { InvalidNumberError } from "./errors.js";
import { parseNumericInput } from "../utils/decimal.js";
import type { ParsedNumber } from "../types/conversion.js";

/**
 * Checks whether an input is a valid, parseable numeric value supported by the converter.
 *
 * Supports:
 * - JavaScript `number` (excluding `NaN`, `Infinity`, `-Infinity`)
 * - JavaScript `bigint`
 * - Clean or formatted numeric `string` (e.g., "1500", " 1,250.75 ", "-42.5")
 */
export function isSupportedNumber(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  if (
    typeof value !== "number" &&
    typeof value !== "bigint" &&
    typeof value !== "string"
  ) {
    return false;
  }
  try {
    parseNumericInput(value, { strict: true });
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates and safely parses an input value into a ParsedNumber object.
 * Throws InvalidNumberError or NumberOutOfRangeError if validation fails.
 */
export function validateNumberInput(
  value: unknown,
  options: { strict?: boolean } = {}
): ParsedNumber {
  if (value === null || value === undefined) {
    throw new InvalidNumberError("Value cannot be null or undefined.");
  }
  if (
    typeof value !== "number" &&
    typeof value !== "bigint" &&
    typeof value !== "string"
  ) {
    throw new InvalidNumberError(
      `Unsupported input type "${typeof value}". Expected number, string, or bigint.`
    );
  }

  return parseNumericInput(value, options);
}
