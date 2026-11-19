import { describe, it, expect } from "vitest";
import {
  numberToAmharicWords,
  decimalToAmharicWords,
  currencyToAmharicWords,
  formatAmountInAmharic,
  getCurrency,
  registerCurrency,
  NumberOutOfRangeError,
  ConfigurationError,
  InvalidNumberError,
} from "../../src/index.js";
import { convertTwoDigitNumber, convertThreeDigitGroup } from "../../src/linguistic/grammar-rules.js";
import { formatScaleGroup } from "../../src/linguistic/group-rules.js";
import { composeIntegerWords } from "../../src/linguistic/composition.js";
import { roundToPrecision } from "../../src/utils/decimal.js";
import { attachAmharicPreposition } from "../../src/utils/string.js";

describe("Coverage Boost Edge Cases", () => {
  it("handles decimal numbers with all zeros as fraction (.00)", () => {
    expect(
      decimalToAmharicWords("100.00", {
        includeIntegerPart: false,
        decimalMode: "number",
      })
    ).toBe("ዜሮ ዜሮ");
  });

  it("handles decimalToAmharicWords with includeIntegerPart: false on integer values", () => {
    expect(
      decimalToAmharicWords("100", {
        includeIntegerPart: false,
      })
    ).toBe("");
  });

  it("handles majorPlacement 'before' in currency converter", () => {
    registerCurrency({
      code: "TEST_CURR",
      majorUnit: "ዶላር",
      minorUnit: "ሳንቲም",
      decimals: 2,
      majorPlacement: "before",
    });

    expect(currencyToAmharicWords(100, { currency: "TEST_CURR" })).toBe(
      "ዶላር አንድ መቶ"
    );
  });

  it("handles negative currency values", () => {
    expect(currencyToAmharicWords(-1500)).toBe(
      "አሉታዊ አንድ ሺህ አምስት መቶ ብር"
    );
    expect(currencyToAmharicWords("-50.25")).toBe(
      "አሉታዊ ሃምሳ ብር ከሃያ አምስት ሳንቲም"
    );
  });

  it("handles zeroMinorMode on zero-decimal currency", () => {
    registerCurrency({
      code: "NODEC",
      majorUnit: "ሳንቲም",
      minorUnit: "",
      decimals: 0,
    });
    expect(
      currencyToAmharicWords(100, {
        currency: "NODEC",
        zeroMinorMode: "words",
      })
    ).toBe("አንድ መቶ ሳንቲም");
  });

  it("handles zero values with isStandalone: false in grammar rules", () => {
    expect(convertTwoDigitNumber(0, undefined, false)).toBe("");
    expect(convertThreeDigitGroup(0, undefined, false)).toBe("");
  });

  it("handles formatScaleGroup with group.value === 0", () => {
    expect(
      formatScaleGroup({ index: 1, value: 0, rawString: "000" })
    ).toBe("");
  });

  it("throws NumberOutOfRangeError in formatScaleGroup for index >= SCALE_NAMES.length", () => {
    expect(() =>
      formatScaleGroup({ index: 99, value: 5, rawString: "005" })
    ).toThrow(NumberOutOfRangeError);
  });

  it("handles empty or zero strings in composeIntegerWords", () => {
    expect(composeIntegerWords("")).toBe("ዜሮ");
    expect(composeIntegerWords("000")).toBe("ዜሮ");
  });

  it("handles precision carry over in roundToPrecision", () => {
    // 9.99 with precision 1 -> carry over to 10.0
    const rounded = roundToPrecision("9", "99", 1);
    expect(rounded.integerPart).toBe("10");
    expect(rounded.fractionalPart).toBe("0");

    // 9.5 with precision 0 -> carry over to 10
    const rounded0 = roundToPrecision("9", "5", 0);
    expect(rounded0.integerPart).toBe("10");
    expect(rounded0.fractionalPart).toBeNull();
  });

  it("handles scientific notation edge cases in parseNumericInput", () => {
    // e+0 or exponent 0
    expect(numberToAmharicWords("100e0")).toBe("አንድ መቶ");
    // negative exponent with leading zeros
    expect(numberToAmharicWords("1e-2")).toBe("ዜሮ ነጥብ ዜሮ አንድ");
  });

  it("handles InvalidNumberError with details", () => {
    const err = new InvalidNumberError("bad number", { detail: "extra" });
    expect((err as Record<string, unknown>).details).toEqual({
      detail: "extra",
    });
  });

  it("handles getCurrency with invalid definition object", () => {
    expect(() =>
      // @ts-expect-error test invalid object
      getCurrency({ code: "" })
    ).toThrow(ConfigurationError);
  });

  it("handles formatAmountInAmharic fallback / unknown style", () => {
    expect(
      // @ts-expect-error test invalid style fallback
      formatAmountInAmharic(1500, { style: "unknown" })
    ).toBe("አንድ ሺህ አምስት መቶ ብር");
  });

  it("handles attachAmharicPreposition with empty target or prep", () => {
    expect(attachAmharicPreposition("", "ሃምሳ")).toBe("ሃምሳ");
    expect(attachAmharicPreposition("ከ", "")).toBe("");
    expect(attachAmharicPreposition("ከ", "   ")).toBe("");
  });
});
