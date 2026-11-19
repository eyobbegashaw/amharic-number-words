import { describe, it, expect } from "vitest";
import { toChequeWords } from "../../src/index.js";

describe("Cheque Writing Mode (toChequeWords)", () => {
  it("formats standard cheque amount with 'ብቻ' suffix", () => {
    expect(toChequeWords(1500)).toBe(
      "አንድ ሺህ አምስት መቶ ብር ብቻ"
    );
  });

  it("formats cheque amount with santim and 'ብቻ'", () => {
    expect(toChequeWords(1540.5)).toBe(
      "አንድ ሺህ አምስት መቶ አርባ ብር ከሃምሳ ሳንቲም ብቻ"
    );
    expect(toChequeWords(1540.75)).toBe(
      "አንድ ሺህ አምስት መቶ አርባ ብር ከሰባ አምስት ሳንቲም ብቻ"
    );
  });

  it("handles zero santim with fraction mode for bank cheques", () => {
    expect(
      toChequeWords(1500, { zeroMinorMode: "fraction" })
    ).toBe("አንድ ሺህ አምስት መቶ ብር ከ 00/100 ሳንቲም ብቻ");
  });

  it("handles non-zero santim with fraction mode for bank cheques", () => {
    expect(
      toChequeWords(1540.5, { minorFormat: "fraction" })
    ).toBe("አንድ ሺህ አምስት መቶ አርባ ብር ከ 50/100 ሳንቲም ብቻ");
  });

  it("supports custom closing phrases", () => {
    expect(
      toChequeWords(1500, { closingPhrase: "ብቻ ተከፋይ" })
    ).toBe("አንድ ሺህ አምስት መቶ ብር ብቻ ተከፋይ");

    expect(toChequeWords(1500, { closingPhrase: "" })).toBe(
      "አንድ ሺህ አምስት መቶ ብር"
    );
  });

  it("supports optional prefix phrase", () => {
    expect(toChequeWords(1500, { prefixPhrase: "ክፍያ፡" })).toBe(
      "ክፍያ፡ አንድ ሺህ አምስት መቶ ብር ብቻ"
    );
  });

  it("supports other currencies in cheque mode", () => {
    expect(toChequeWords(500.5, { currency: "USD" })).toBe(
      "አምስት መቶ ዶላር ከሃምሳ ሴንት ብቻ"
    );
  });
});
