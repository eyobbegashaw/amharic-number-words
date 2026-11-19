import {
  registerCurrency,
  currencyToAmharicWords,
} from "../src/index.js";

// Register custom currency globally (e.g., UAE Dirham)
registerCurrency({
  code: "AED",
  majorUnit: "ዲርሃም",
  minorUnit: "ፊልስ",
  decimals: 2,
  minorConnector: "ከ",
});

console.log(currencyToAmharicWords(450.5, { currency: "AED" }));
// => "አራት መቶ ሃምሳ ዲርሃም ከሃምሳ ፊልስ"

// Or provide a currency definition inline without registering
const saudiRiyal = {
  code: "SAR",
  majorUnit: "ሪያል",
  minorUnit: "ሃላላ",
  decimals: 2,
};

console.log(currencyToAmharicWords(1200.75, { currency: saudiRiyal }));
// => "አንድ ሺህ ሁለት መቶ ሪያል ከሰባ አምስት ሃላላ"
