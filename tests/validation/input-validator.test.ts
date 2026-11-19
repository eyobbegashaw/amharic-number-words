import { describe, it, expect } from "vitest";
import {
  isSupportedNumber,
  validateNumberInput,
  InvalidNumberError,
  NumberOutOfRangeError,
  numberToAmharicWords,
} from "../../src/index.js";

describe("Input Validation and Error Handling", () => {
  describe("isSupportedNumber", () => {
    it("returns true for valid numeric types", () => {
      expect(isSupportedNumber(0)).toBe(true);
      expect(isSupportedNumber(1500)).toBe(true);
      expect(isSupportedNumber(-42.5)).toBe(true);
      expect(isSupportedNumber(1500n)).toBe(true);
      expect(isSupportedNumber("1500")).toBe(true);
      expect(isSupportedNumber(" 1,250.75 ")).toBe(true);
      expect(isSupportedNumber("-0.5")).toBe(true);
      expect(isSupportedNumber(".5")).toBe(true);
    });

    it("returns false for invalid values", () => {
      expect(isSupportedNumber(NaN)).toBe(false);
      expect(isSupportedNumber(Infinity)).toBe(false);
      expect(isSupportedNumber(-Infinity)).toBe(false);
      expect(isSupportedNumber(null)).toBe(false);
      expect(isSupportedNumber(undefined)).toBe(false);
      expect(isSupportedNumber("")).toBe(false);
      expect(isSupportedNumber("   ")).toBe(false);
      expect(isSupportedNumber("abc")).toBe(false);
      expect(isSupportedNumber("12.34.56")).toBe(false);
      expect(isSupportedNumber({})).toBe(false);
      expect(isSupportedNumber([])).toBe(false);
    });
  });

  describe("validateNumberInput", () => {
    it("throws InvalidNumberError on null or undefined", () => {
      expect(() => validateNumberInput(null)).toThrow(InvalidNumberError);
      expect(() => validateNumberInput(undefined)).toThrow(InvalidNumberError);
    });

    it("throws InvalidNumberError on NaN or Infinity", () => {
      expect(() => validateNumberInput(NaN)).toThrow(InvalidNumberError);
      expect(() => validateNumberInput(Infinity)).toThrow(InvalidNumberError);
      expect(() => validateNumberInput(-Infinity)).toThrow(InvalidNumberError);
    });

    it("throws InvalidNumberError on empty or invalid strings", () => {
      expect(() => validateNumberInput("")).toThrow(InvalidNumberError);
      expect(() => validateNumberInput("  ")).toThrow(InvalidNumberError);
      expect(() => validateNumberInput("not-a-number")).toThrow(
        InvalidNumberError
      );
    });

    it("throws InvalidNumberError on unsupported types", () => {
      expect(() => validateNumberInput({})).toThrow(InvalidNumberError);
      expect(() => validateNumberInput([])).toThrow(InvalidNumberError);
      expect(() => validateNumberInput(true)).toThrow(InvalidNumberError);
    });

    it("throws NumberOutOfRangeError for excessive digits (over 100 digits)", () => {
      const huge = "9".repeat(101);
      expect(() => numberToAmharicWords(huge)).toThrow(
        NumberOutOfRangeError
      );
    });
  });
});
