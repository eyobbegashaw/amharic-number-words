import { describe, it, expect } from "vitest";
import { numberToAmharicWords } from "../../src/index.js";

describe("Amharic Linguistic and Spelling Customization", () => {
  describe("sostSpelling ('ሦስት' vs 'ሶስት')", () => {
    it("uses 'ሦስት' by default", () => {
      expect(numberToAmharicWords(3)).toBe("ሦስት");
      expect(numberToAmharicWords(13)).toBe("አስራ ሦስት");
      expect(numberToAmharicWords(300)).toBe("ሦስት መቶ");
    });

    it("supports modern 'ሶስት' spelling option", () => {
      expect(numberToAmharicWords(3, { sostSpelling: "ሶስት" })).toBe("ሶስት");
      expect(numberToAmharicWords(13, { sostSpelling: "ሶስት" })).toBe(
        "አስራ ሶስት"
      );
      expect(numberToAmharicWords(300, { sostSpelling: "ሶስት" })).toBe(
        "ሶስት መቶ"
      );
    });
  });

  describe("asirSpelling ('አስር' vs 'ዐስር')", () => {
    it("uses 'አስር' by default", () => {
      expect(numberToAmharicWords(10)).toBe("አስር");
    });

    it("supports traditional 'ዐስር' spelling", () => {
      expect(numberToAmharicWords(10, { asirSpelling: "ዐስር" })).toBe("ዐስር");
    });
  });

  describe("hamsaSpelling ('ሃምሳ' vs 'አምሳ')", () => {
    it("uses 'ሃምሳ' by default", () => {
      expect(numberToAmharicWords(50)).toBe("ሃምሳ");
      expect(numberToAmharicWords(55)).toBe("ሃምሳ አምስት");
    });

    it("supports colloquial 'አምሳ' spelling", () => {
      expect(numberToAmharicWords(50, { hamsaSpelling: "አምሳ" })).toBe("አምሳ");
      expect(numberToAmharicWords(55, { hamsaSpelling: "አምሳ" })).toBe(
        "አምሳ አምስት"
      );
    });
  });

  describe("shihSpelling ('ሺህ' vs 'ሺ')", () => {
    it("uses 'ሺህ' by default", () => {
      expect(numberToAmharicWords(1000)).toBe("አንድ ሺህ");
      expect(numberToAmharicWords(5000)).toBe("አምስት ሺህ");
    });

    it("supports informal 'ሺ' spelling", () => {
      expect(numberToAmharicWords(1000, { shihSpelling: "ሺ" })).toBe(
        "አንድ ሺ"
      );
      expect(numberToAmharicWords(5000, { shihSpelling: "ሺ" })).toBe(
        "አምስት ሺ"
      );
    });
  });

  describe("leadingOneHundred option", () => {
    it("uses 'አንድ መቶ' by default (banking/security standard)", () => {
      expect(numberToAmharicWords(100)).toBe("አንድ መቶ");
      expect(numberToAmharicWords(101)).toBe("አንድ መቶ አንድ");
    });

    it("allows 'መቶ' when leadingOneHundred is false", () => {
      expect(numberToAmharicWords(100, { leadingOneHundred: false })).toBe(
        "መቶ"
      );
      expect(numberToAmharicWords(101, { leadingOneHundred: false })).toBe(
        "መቶ አንድ"
      );
    });
  });

  describe("leadingOneThousand option", () => {
    it("uses 'አንድ ሺህ' by default", () => {
      expect(numberToAmharicWords(1000)).toBe("አንድ ሺህ");
    });

    it("allows 'ሺህ' when leadingOneThousand is false", () => {
      expect(numberToAmharicWords(1000, { leadingOneThousand: false })).toBe(
        "ሺህ"
      );
    });
  });
});
