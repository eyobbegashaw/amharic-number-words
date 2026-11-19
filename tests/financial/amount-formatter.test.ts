import { describe, it, expect } from "vitest";
import {
  amountToAmharicWords,
  formatAmountInAmharic,
} from "../../src/index.js";

describe("Receipt, Invoice, and Amount Formatting", () => {
  describe("amountToAmharicWords", () => {
    it("converts amount to plain words when no currency given", () => {
      expect(amountToAmharicWords(1500)).toBe(
        "አንድ ሺህ አምስት መቶ"
      );
      expect(amountToAmharicWords(1250.75)).toBe(
        "አንድ ሺህ ሁለት መቶ ሃምሳ ነጥብ ሰባት አምስት"
      );
    });

    it("converts amount with currency when currency is specified", () => {
      expect(amountToAmharicWords(1500, { currency: "ETB" })).toBe(
        "አንድ ሺህ አምስት መቶ ብር"
      );
    });
  });

  describe("formatAmountInAmharic", () => {
    it("supports style 'plain'", () => {
      expect(formatAmountInAmharic(1500, { style: "plain" })).toBe(
        "አንድ ሺህ አምስት መቶ"
      );
    });

    it("supports style 'currency'", () => {
      expect(
        formatAmountInAmharic(1500, { style: "currency", currency: "ETB" })
      ).toBe("አንድ ሺህ አምስት መቶ ብር");
    });

    it("supports style 'cheque'", () => {
      expect(
        formatAmountInAmharic(1500, { style: "cheque", currency: "ETB" })
      ).toBe("አንድ ሺህ አምስት መቶ ብር ብቻ");
    });

    it("supports style 'receipt'", () => {
      expect(
        formatAmountInAmharic(1500.5, {
          style: "receipt",
          currency: "ETB",
        })
      ).toBe("የተከፈለ መጠን፡ አንድ ሺህ አምስት መቶ ብር ከሃምሳ ሳንቲም");

      // Custom label
      expect(
        formatAmountInAmharic(1500, {
          style: "receipt",
          currency: "ETB",
          customLabel: "ደረሰኝ ቁጥር 01፡",
        })
      ).toBe("ደረሰኝ ቁጥር 01፡ አንድ ሺህ አምስት መቶ ብር");
    });

    it("supports style 'invoice'", () => {
      expect(
        formatAmountInAmharic(1500.5, {
          style: "invoice",
          currency: "ETB",
        })
      ).toBe("ጠቅላላ ድምር፡ አንድ ሺህ አምስት መቶ ብር ከሃምሳ ሳንቲም");

      // Custom label
      expect(
        formatAmountInAmharic(1500, {
          style: "invoice",
          currency: "ETB",
          customLabel: "ጠቅላላ ሂሳብ፡",
        })
      ).toBe("ጠቅላላ ሂሳብ፡ አንድ ሺህ አምስት መቶ ብር");
    });
  });
});
