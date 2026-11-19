import { InvalidNumberError, NumberOutOfRangeError } from "../validation/errors.js";
import type { ParsedNumber } from "../types/conversion.js";

/**
 * Expands scientific notation strings (e.g., "1e-5", "2.5e+4") into full decimal strings.
 */
function expandScientificNotation(str: string): string {
  const match = str.match(/^([+-]?\d+(?:\.\d+)?)[eE][+]?(-?\d+)$/);
  if (!match || !match[1] || !match[2]) return str;

  const coefficient = match[1];
  const exponent = parseInt(match[2], 10);

  const parts = coefficient.split(".");
  const intPart = parts[0] ?? "";
  const sign = intPart.startsWith("-") ? "-" : intPart.startsWith("+") ? "+" : "";
  const rawInt = sign ? intPart.slice(1) : intPart;
  const rawDec = parts[1] ?? "";

  if (exponent === 0) {
    return sign + rawInt + (rawDec ? "." + rawDec : "");
  }

  if (exponent > 0) {
    if (exponent >= rawDec.length) {
      return sign + rawInt + rawDec + "0".repeat(exponent - rawDec.length);
    }
    return (
      sign +
      rawInt +
      rawDec.slice(0, exponent) +
      "." +
      rawDec.slice(exponent)
    );
  } else {
    // exponent < 0
    const absExp = Math.abs(exponent);
    const combined = rawInt + rawDec;
    return sign + "0." + "0".repeat(absExp - 1) + combined;
  }
}

/**
 * Safely parses any supported number representation into structured parts:
 * sign, normalized integer digits, and fractional digits.
 */
export function parseNumericInput(
  value: number | string | bigint,
  options: { strict?: boolean } = {}
): ParsedNumber {
  const { strict = true } = options;

  if (value === null || value === undefined) {
    throw new InvalidNumberError("Value cannot be null or undefined.");
  }

  let raw: string;

  if (typeof value === "bigint") {
    raw = value.toString();
  } else if (typeof value === "number") {
    if (Number.isNaN(value)) {
      throw new InvalidNumberError("Value cannot be NaN.");
    }
    if (!Number.isFinite(value)) {
      throw new InvalidNumberError("Value must be a finite number.");
    }
    raw = value.toString();
  } else if (typeof value === "string") {
    raw = value.trim();
    if (raw === "") {
      throw new InvalidNumberError("Value cannot be an empty string.");
    }
    // Remove underscores and commas used as group separators
    raw = raw.replace(/[_,]/g, "");
  } else {
    throw new InvalidNumberError(
      `Unsupported input type "${typeof value}". Expected number, string, or bigint.`
    );
  }

  // Expand any scientific notation
  if (raw.toLowerCase().includes("e")) {
    raw = expandScientificNotation(raw);
  }

  // Validate numeric format: optional sign, digits, optional dot, optional digits
  const validNumericRegex = /^[+-]?(?:\d+\.?\d*|\.\d+)$/;
  if (!validNumericRegex.test(raw)) {
    if (strict) {
      throw new InvalidNumberError(`Invalid numeric string "${raw}".`);
    }
  }

  let isNegative = false;
  let body = raw;

  if (body.startsWith("-")) {
    isNegative = true;
    body = body.slice(1);
  } else if (body.startsWith("+")) {
    body = body.slice(1);
  }

  const dotIndex = body.indexOf(".");
  let integerPart = "";
  let fractionalPart: string | null = null;

  if (dotIndex !== -1) {
    integerPart = body.slice(0, dotIndex);
    fractionalPart = body.slice(dotIndex + 1);
  } else {
    integerPart = body;
    fractionalPart = null;
  }

  // Normalize integer part: default to "0" if empty (e.g., ".5")
  if (!integerPart) {
    integerPart = "0";
  } else {
    // Strip leading zeros
    integerPart = integerPart.replace(/^0+/, "");
    if (!integerPart) {
      integerPart = "0";
    }
  }

  // If fractional part is empty string (e.g. "123."), normalize to null
  if (fractionalPart !== null && fractionalPart.length === 0) {
    fractionalPart = null;
  }

  // If the number is -0 or -0.000..., it shouldn't be negative
  const isFractionAllZeros =
    fractionalPart === null || /^0+$/.test(fractionalPart);
  if (integerPart === "0" && isFractionAllZeros) {
    isNegative = false;
  }

  // Maximum length check to avoid DOS on massive inputs
  if (integerPart.length > 100) {
    throw new NumberOutOfRangeError(
      `Number magnitude exceeds maximum supported digits (${integerPart.length} > 100).`
    );
  }

  return {
    isNegative,
    integerPart,
    fractionalPart,
    originalInput: value,
  };
}

/**
 * Rounds or truncates the fractional part to a specified precision safely.
 * Returns the adjusted integer part (with any carry-over) and the new fractional part.
 */
export function roundToPrecision(
  integerPart: string,
  fractionalPart: string | null,
  precision: number
): { integerPart: string; fractionalPart: string | null } {
  if (precision < 0) {
    throw new InvalidNumberError("Decimal precision cannot be negative.");
  }
  if (!fractionalPart) {
    return {
      integerPart,
      fractionalPart: precision > 0 ? "0".repeat(precision) : null,
    };
  }

  if (precision === 0) {
    const firstDigit = parseInt(fractionalPart[0] ?? "0", 10);
    if (firstDigit >= 5) {
      const incremented = (BigInt(integerPart) + 1n).toString();
      return { integerPart: incremented, fractionalPart: null };
    }
    return { integerPart, fractionalPart: null };
  }

  if (fractionalPart.length <= precision) {
    return {
      integerPart,
      fractionalPart: fractionalPart.padEnd(precision, "0"),
    };
  }

  // Needs rounding: check the digit immediately following the precision cutoff
  const kept = fractionalPart.slice(0, precision);
  const nextDigit = parseInt(fractionalPart[precision] ?? "0", 10);

  if (nextDigit >= 5) {
    const roundedFraction = BigInt(kept) + 1n;
    const roundedStr = roundedFraction.toString().padStart(precision, "0");

    if (roundedStr.length > precision) {
      // Carried over to integer part!
      const incrementedInt = (BigInt(integerPart) + 1n).toString();
      return {
        integerPart: incrementedInt,
        fractionalPart: roundedStr.slice(1),
      };
    }
    return { integerPart, fractionalPart: roundedStr };
  }

  return { integerPart, fractionalPart: kept };
}
