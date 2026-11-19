import { describe, it, expect, beforeEach } from "vitest";
import {
  currencyToAmharicWords,
  registerCurrency,
  resetCurrencyRegistry,
  getCurrency,
  hasCurrency,
  UnsupportedCurrencyError,
  ConfigurationError,
} from "../../src/index.js";

describe("Currency and Financial Amount Conversion", () => {
  beforeEach(() => {
    resetCurrencyRegistry();
  });

  describe("Ethiopian Birr (ETB)", () => {
    it("converts whole ETB amounts", () => {
      expect(currencyToAmharicWords(1500)).toBe(
        "አንድ ሺህ አምስት መቶ ብር"
      );
      expect(currencyToAmharicWords(0)).toBe("ዜሮ ብር");
      expect(currencyToAmharicWords(1)).toBe("አንድ ብር");
    });

    it("converts ETB with santim (minor unit)", () => {
      expect(currencyToAmharicWords(1500.5)).toBe(
        "አንድ ሺህ አምስት መቶ ብር ከሃምሳ ሳንቲም"
      );
      expect(currencyToAmharicWords(1500.75)).toBe(
        "አንድ ሺህ አምስት መቶ ብር ከሰባ አምስት ሳንቲም"
      );
      expect(currencyToAmharicWords(1500.05)).toBe(
        "አንድ ሺህ አምስት መቶ ብር ከአምስት ሳንቲም"
      );
    });

    it("handles zero santim with zeroMinorMode", () => {
      // default: omit
      expect(
        currencyToAmharicWords(1500, { zeroMinorMode: "omit" })
      ).toBe("አንድ ሺህ አምስት መቶ ብር");

      // words
      expect(
        currencyToAmharicWords(1500, { zeroMinorMode: "words" })
      ).toBe("አንድ ሺህ አምስት መቶ ብር ከዜሮ ሳንቲም");

      // fraction
      expect(
        currencyToAmharicWords(1500, { zeroMinorMode: "fraction" })
      ).toBe("አንድ ሺህ አምስት መቶ ብር ከ 00/100 ሳንቲም");
    });

    it("converts minorFormat 'fraction' and 'digits'", () => {
      expect(
        currencyToAmharicWords(1500.5, { minorFormat: "fraction" })
      ).toBe("አንድ ሺህ አምስት መቶ ብር ከ 50/100 ሳንቲም");

      expect(
        currencyToAmharicWords(1500.5, { minorFormat: "digits" })
      ).toBe("አንድ ሺህ አምስት መቶ ብር ከ 50 ሳንቲም");
    });

    it("handles fractional amounts with zero major (0.75 ETB)", () => {
      // default showZeroMajor: false -> no "ከ", pure "ሰባ አምስት ሳንቲም"
      expect(currencyToAmharicWords(0.75)).toBe("ሰባ አምስት ሳንቲም");

      // showZeroMajor: true
      expect(
        currencyToAmharicWords(0.75, { showZeroMajor: true })
      ).toBe("ዜሮ ብር ከሰባ አምስት ሳንቲም");
    });

    it("supports prefixPreposition option", () => {
      // default: true -> "ከሃምሳ"
      expect(currencyToAmharicWords(1500.5)).toBe(
        "አንድ ሺህ አምስት መቶ ብር ከሃምሳ ሳንቲም"
      );

      // false -> "ከ ሃምሳ"
      expect(
        currencyToAmharicWords(1500.5, { prefixPreposition: false })
      ).toBe("አንድ ሺህ አምስት መቶ ብር ከ ሃምሳ ሳንቲም");
    });
  });

  describe("US Dollar (USD)", () => {
    it("converts USD amounts", () => {
      expect(currencyToAmharicWords(100, { currency: "USD" })).toBe(
        "አንድ መቶ ዶላር"
      );
      expect(currencyToAmharicWords(100.5, { currency: "USD" })).toBe(
        "አንድ መቶ ዶላር ከሃምሳ ሴንት"
      );
    });
  });

  describe("Euro and Pound", () => {
    it("converts EUR amounts", () => {
      expect(currencyToAmharicWords(250.75, { currency: "EUR" })).toBe(
        "ሁለት መቶ ሃምሳ ዩሮ ከሰባ አምስት ሴንት"
      );
    });

    it("converts GBP amounts", () => {
      expect(currencyToAmharicWords(10.5, { currency: "GBP" })).toBe(
        "አስር ፓውንድ ከሃምሳ ፔንስ"
      );
    });
  });

  describe("Custom currency registration", () => {
    it("allows registering and using custom currency", () => {
      registerCurrency({
        code: "JPY",
        majorUnit: "የን",
        minorUnit: "ሴን",
        decimals: 0,
      });

      expect(hasCurrency("JPY")).toBe(true);
      expect(currencyToAmharicWords(5000, { currency: "JPY" })).toBe(
        "አምስት ሺህ የን"
      );
    });

    it("allows inline custom currency definition object", () => {
      const custom = {
        code: "CAD",
        majorUnit: "የካናዳ ዶላር",
        minorUnit: "ሴንት",
        decimals: 2,
      };

      expect(currencyToAmharicWords(200.5, { currency: custom })).toBe(
        "ሁለት መቶ የካናዳ ዶላር ከሃምሳ ሴንት"
      );
    });

    it("throws UnsupportedCurrencyError for unknown currency", () => {
      expect(() =>
        currencyToAmharicWords(100, { currency: "XYZ" })
      ).toThrow(UnsupportedCurrencyError);
    });

    it("validates currency registration fields", () => {
      expect(() =>
        // @ts-expect-error test invalid object
        registerCurrency(null)
      ).toThrow(ConfigurationError);

      expect(() =>
        // @ts-expect-error test missing code
        registerCurrency({ majorUnit: "ብር", minorUnit: "ሳንቲም", decimals: 2 })
      ).toThrow(ConfigurationError);

      expect(() =>
        // @ts-expect-error test missing majorUnit
        registerCurrency({ code: "ABC", minorUnit: "ሳንቲም", decimals: 2 })
      ).toThrow(ConfigurationError);

      expect(() =>
        registerCurrency({
          code: "ABC",
          majorUnit: "ብር",
          minorUnit: "ሳንቲም",
          decimals: -1,
        })
      ).toThrow(ConfigurationError);
    });
  });
});
