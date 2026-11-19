import { describe, it, expect } from "vitest";
import {
  numberToAmharicWords,
  integerToAmharicWords,
  decimalToAmharicWords,
} from "../../src/index.js";

describe("Edge Cases and Advanced Conversions", () => {
  describe("BigInt inputs", () => {
    it("handles large BigInt values", () => {
      expect(numberToAmharicWords(1500n)).toBe("አንድ ሺህ አምስት መቶ");
      expect(numberToAmharicWords(1000000000000n)).toBe("አንድ ትሪሊዮን");
      expect(numberToAmharicWords(2500000000000000n)).toBe(
        "ሁለት ኳድሪሊዮን አምስት መቶ ትሪሊዮን"
      );
    });
  });

  describe("Negative numbers", () => {
    it("prefixes with default 'አሉታዊ'", () => {
      expect(numberToAmharicWords(-1)).toBe("አሉታዊ አንድ");
      expect(numberToAmharicWords(-1500)).toBe(
        "አሉታዊ አንድ ሺህ አምስት መቶ"
      );
      expect(numberToAmharicWords("-45.5")).toBe(
        "አሉታዊ አርባ አምስት ነጥብ አምስት"
      );
    });

    it("supports custom negative prefixes ('ኔጌቲቭ', 'ሲቀነስ')", () => {
      expect(
        numberToAmharicWords(-50, { negativePrefix: "ኔጌቲቭ" })
      ).toBe("ኔጌቲቭ ሃምሳ");
      expect(
        numberToAmharicWords(-100, { negativePrefix: "ሲቀነስ" })
      ).toBe("ሲቀነስ አንድ መቶ");
    });

    it("handles negative zero correctly as ዜሮ", () => {
      expect(numberToAmharicWords(-0)).toBe("ዜሮ");
      expect(numberToAmharicWords("-0")).toBe("ዜሮ");
      expect(numberToAmharicWords("-0.00")).toBe("ዜሮ");
    });
  });

  describe("Decimals and precision", () => {
    it("converts decimals in 'digits' mode by default", () => {
      expect(numberToAmharicWords(1250.75)).toBe(
        "አንድ ሺህ ሁለት መቶ ሃምሳ ነጥብ ሰባት አምስት"
      );
      expect(numberToAmharicWords("1250.05")).toBe(
        "አንድ ሺህ ሁለት መቶ ሃምሳ ነጥብ ዜሮ አምስት"
      );
    });

    it("converts decimals in 'number' mode", () => {
      expect(
        numberToAmharicWords(1250.75, { decimalMode: "number" })
      ).toBe("አንድ ሺህ ሁለት መቶ ሃምሳ ነጥብ ሰባ አምስት");
      expect(
        numberToAmharicWords("1250.05", { decimalMode: "number" })
      ).toBe("አንድ ሺህ ሁለት መቶ ሃምሳ ነጥብ ዜሮ አምስት");
    });

    it("supports custom decimalPointWord", () => {
      expect(
        numberToAmharicWords(3.14, { decimalPointWord: "ነጥብ" })
      ).toBe("ሦስት ነጥብ አንድ አራት");
    });

    it("supports decimalPrecision option", () => {
      // 12.3456 with precision 2 -> 12.35
      expect(numberToAmharicWords(12.3456, { decimalPrecision: 2 })).toBe(
        "አስራ ሁለት ነጥብ ሦስት አምስት"
      );
      // 12.344 with precision 2 -> 12.34
      expect(numberToAmharicWords(12.344, { decimalPrecision: 2 })).toBe(
        "አስራ ሁለት ነጥብ ሦስት አራት"
      );
      // precision 0 rounds to integer
      expect(numberToAmharicWords(12.6, { decimalPrecision: 0 })).toBe(
        "አስራ ሦስት"
      );
    });

    it("supports decimalToAmharicWords with includeIntegerPart: false", () => {
      expect(
        decimalToAmharicWords("0.75", { includeIntegerPart: false })
      ).toBe("ሰባት አምስት");
      expect(
        decimalToAmharicWords("0.75", {
          includeIntegerPart: false,
          decimalMode: "number",
        })
      ).toBe("ሰባ አምስት");
    });
  });

  describe("Zeros in number groups", () => {
    it("handles zeros between digits correctly", () => {
      expect(numberToAmharicWords(1001)).toBe("አንድ ሺህ አንድ");
      expect(numberToAmharicWords(10001)).toBe("አስር ሺህ አንድ");
      expect(numberToAmharicWords(1000001)).toBe("አንድ ሚሊዮን አንድ");
      expect(numberToAmharicWords(1005000)).toBe(
        "አንድ ሚሊዮን አምስት ሺህ"
      );
      expect(numberToAmharicWords(1000000001)).toBe("አንድ ቢሊዮን አንድ");
    });
  });

  describe("Formatted numeric strings", () => {
    it("handles whitespace, commas and underscores", () => {
      expect(numberToAmharicWords(" 1,500 ")).toBe("አንድ ሺህ አምስት መቶ");
      expect(numberToAmharicWords("1_500_000")).toBe(
        "አንድ ሚሊዮን አምስት መቶ ሺህ"
      );
      expect(numberToAmharicWords(" +500 ")).toBe("አምስት መቶ");
    });

    it("handles leading zeros in strings", () => {
      expect(numberToAmharicWords("007")).toBe("ሰባት");
      expect(numberToAmharicWords("00100")).toBe("አንድ መቶ");
    });

    it("handles scientific notation strings", () => {
      expect(numberToAmharicWords("1e3")).toBe("አንድ ሺህ");
      expect(numberToAmharicWords("2.5e3")).toBe("ሁለት ሺህ አምስት መቶ");
    });
  });

  describe("integerToAmharicWords strict mode", () => {
    it("throws on decimal numbers when strictInteger is true", () => {
      expect(() => integerToAmharicWords(12.5)).toThrowError(
        /Expected an integer/
      );
    });

    it("allows .00 fractional values in integerToAmharicWords", () => {
      expect(integerToAmharicWords("1500.00")).toBe(
        "አንድ ሺህ አምስት መቶ"
      );
    });
  });
});
