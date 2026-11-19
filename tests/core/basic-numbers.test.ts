import { describe, it, expect } from "vitest";
import { numberToAmharicWords } from "../../src/index.js";

describe("Basic Number Conversion", () => {
  describe("Single digits (0-9)", () => {
    it("converts 0 correctly", () => {
      expect(numberToAmharicWords(0)).toBe("ዜሮ");
    });

    it("converts 1-9 correctly", () => {
      expect(numberToAmharicWords(1)).toBe("አንድ");
      expect(numberToAmharicWords(2)).toBe("ሁለት");
      expect(numberToAmharicWords(3)).toBe("ሦስት");
      expect(numberToAmharicWords(4)).toBe("አራት");
      expect(numberToAmharicWords(5)).toBe("አምስት");
      expect(numberToAmharicWords(6)).toBe("ስድስት");
      expect(numberToAmharicWords(7)).toBe("ሰባት");
      expect(numberToAmharicWords(8)).toBe("ስምንት");
      expect(numberToAmharicWords(9)).toBe("ዘጠኝ");
    });
  });

  describe("Teens (10-19)", () => {
    it("converts 10", () => {
      expect(numberToAmharicWords(10)).toBe("አስር");
    });

    it("converts 11-19 with proper 'አስራ' stem", () => {
      expect(numberToAmharicWords(11)).toBe("አስራ አንድ");
      expect(numberToAmharicWords(12)).toBe("አስራ ሁለት");
      expect(numberToAmharicWords(13)).toBe("አስራ ሦስት");
      expect(numberToAmharicWords(14)).toBe("አስራ አራት");
      expect(numberToAmharicWords(15)).toBe("አስራ አምስት");
      expect(numberToAmharicWords(16)).toBe("አስራ ስድስት");
      expect(numberToAmharicWords(17)).toBe("አስራ ሰባት");
      expect(numberToAmharicWords(18)).toBe("አስራ ስምንት");
      expect(numberToAmharicWords(19)).toBe("አስራ ዘጠኝ");
    });
  });

  describe("Multiples of 10 (20-90)", () => {
    it("converts tens correctly", () => {
      expect(numberToAmharicWords(20)).toBe("ሃያ");
      expect(numberToAmharicWords(30)).toBe("ሰላሳ");
      expect(numberToAmharicWords(40)).toBe("አርባ");
      expect(numberToAmharicWords(50)).toBe("ሃምሳ");
      expect(numberToAmharicWords(60)).toBe("ስድሳ");
      expect(numberToAmharicWords(70)).toBe("ሰባ");
      expect(numberToAmharicWords(80)).toBe("ሰማንያ");
      expect(numberToAmharicWords(90)).toBe("ዘጠና");
    });
  });

  describe("Compound numbers 21-99", () => {
    it("converts compound tens without connectors", () => {
      expect(numberToAmharicWords(21)).toBe("ሃያ አንድ");
      expect(numberToAmharicWords(25)).toBe("ሃያ አምስት");
      expect(numberToAmharicWords(34)).toBe("ሰላሳ አራት");
      expect(numberToAmharicWords(48)).toBe("አርባ ስምንት");
      expect(numberToAmharicWords(55)).toBe("ሃምሳ አምስት");
      expect(numberToAmharicWords(77)).toBe("ሰባ ሰባት");
      expect(numberToAmharicWords(99)).toBe("ዘጠና ዘጠኝ");
    });
  });

  describe("Hundreds (100-999)", () => {
    it("converts 100 by default as 'አንድ መቶ'", () => {
      expect(numberToAmharicWords(100)).toBe("አንድ መቶ");
    });

    it("converts 101 to 'አንድ መቶ አንድ'", () => {
      expect(numberToAmharicWords(101)).toBe("አንድ መቶ አንድ");
    });

    it("converts 115 to 'አንድ መቶ አስራ አምስት'", () => {
      expect(numberToAmharicWords(115)).toBe("አንድ መቶ አስራ አምስት");
    });

    it("converts 125 to 'አንድ መቶ ሃያ አምስት'", () => {
      expect(numberToAmharicWords(125)).toBe("አንድ መቶ ሃያ አምስት");
    });

    it("converts multiples of 100", () => {
      expect(numberToAmharicWords(200)).toBe("ሁለት መቶ");
      expect(numberToAmharicWords(300)).toBe("ሦስት መቶ");
      expect(numberToAmharicWords(400)).toBe("አራት መቶ");
      expect(numberToAmharicWords(500)).toBe("አምስት መቶ");
      expect(numberToAmharicWords(600)).toBe("ስድስት መቶ");
      expect(numberToAmharicWords(700)).toBe("ሰባት መቶ");
      expect(numberToAmharicWords(800)).toBe("ስምንት መቶ");
      expect(numberToAmharicWords(900)).toBe("ዘጠኝ መቶ");
    });

    it("converts 999 to 'ዘጠኝ መቶ ዘጠና ዘጠኝ'", () => {
      expect(numberToAmharicWords(999)).toBe("ዘጠኝ መቶ ዘጠና ዘጠኝ");
    });
  });

  describe("Thousands and Large Numbers", () => {
    it("converts 1000 to 'አንድ ሺህ'", () => {
      expect(numberToAmharicWords(1000)).toBe("አንድ ሺህ");
    });

    it("converts 1500 to 'አንድ ሺህ አምስት መቶ'", () => {
      expect(numberToAmharicWords(1500)).toBe("አንድ ሺህ አምስት መቶ");
    });

    it("converts 10000 to 'አስር ሺህ'", () => {
      expect(numberToAmharicWords(10000)).toBe("አስር ሺህ");
    });

    it("converts 100000 to 'አንድ መቶ ሺህ'", () => {
      expect(numberToAmharicWords(100000)).toBe("አንድ መቶ ሺህ");
    });

    it("converts 1000000 to 'አንድ ሚሊዮን'", () => {
      expect(numberToAmharicWords(1000000)).toBe("አንድ ሚሊዮን");
    });

    it("converts 2500000 to 'ሁለት ሚሊዮን አምስት መቶ ሺህ'", () => {
      expect(numberToAmharicWords(2500000)).toBe("ሁለት ሚሊዮን አምስት መቶ ሺህ");
    });

    it("converts 1000000000 to 'አንድ ቢሊዮን'", () => {
      expect(numberToAmharicWords(1000000000)).toBe("አንድ ቢሊዮን");
    });

    it("converts complex mixed numbers correctly", () => {
      expect(numberToAmharicWords(12345)).toBe(
        "አስራ ሁለት ሺህ ሦስት መቶ አርባ አምስት"
      );
      expect(numberToAmharicWords(1234567)).toBe(
        "አንድ ሚሊዮን ሁለት መቶ ሰላሳ አራት ሺህ አምስት መቶ ስድሳ ሰባት"
      );
    });
  });
});
