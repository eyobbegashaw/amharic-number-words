import { toChequeWords } from "../src/index.js";

// Standard bank cheque for 1,500 ETB
console.log(toChequeWords(1500));
// => "አንድ ሺህ አምስት መቶ ብር ብቻ"

// Cheque with Santim (e.g., 1,540.50 ETB)
console.log(toChequeWords(1540.5));
// => "አንድ ሺህ አምስት መቶ አርባ ብር ከሃምሳ ሳንቲም ብቻ"

// Banking format with 00/100 fraction for zero cents
console.log(toChequeWords(1500, { zeroMinorMode: "fraction" }));
// => "አንድ ሺህ አምስት መቶ ብር ከ 00/100 ሳንቲም ብቻ"

// Banking format with xx/100 fraction for non-zero cents
console.log(toChequeWords(1540.5, { minorFormat: "fraction" }));
// => "አንድ ሺህ አምስት መቶ አርባ ብር ከ 50/100 ሳንቲም ብቻ"

// Cheque in USD
console.log(toChequeWords(2500.75, { currency: "USD" }));
// => "ሁለት ሺህ አምስት መቶ ዶላር ከሰባ አምስት ሴንት ብቻ"
