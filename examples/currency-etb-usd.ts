import { currencyToAmharicWords } from "../src/index.js";

// Ethiopian Birr (ETB)
console.log(currencyToAmharicWords(1500));
// => "አንድ ሺህ አምስት መቶ ብር"

console.log(currencyToAmharicWords(1500.5));
// => "አንድ ሺህ አምስት መቶ ብር ከሃምሳ ሳንቲም"

console.log(currencyToAmharicWords(0.75));
// => "ሰባ አምስት ሳንቲም"

console.log(currencyToAmharicWords(0.75, { showZeroMajor: true }));
// => "ዜሮ ብር ከሰባ አምስት ሳንቲም"

// US Dollar (USD)
console.log(currencyToAmharicWords(100, { currency: "USD" }));
// => "አንድ መቶ ዶላር"

console.log(currencyToAmharicWords(125.75, { currency: "USD" }));
// => "አንድ መቶ ሃያ አምስት ዶላር ከሰባ አምስት ሴንት"

// Euro (EUR)
console.log(currencyToAmharicWords(350.25, { currency: "EUR" }));
// => "ሦስት መቶ ሃምሳ ዩሮ ከሃያ አምስት ሴንት"
