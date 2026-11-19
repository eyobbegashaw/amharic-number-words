import {
  numberToAmharicWords,
  decimalToAmharicWords,
} from "../src/index.js";

// Digits mode (default for decimal numbers: spells each digit)
console.log(numberToAmharicWords(1250.75));
// => "አንድ ሺህ ሁለት መቶ ሃምሳ ነጥብ ሰባት አምስት"

// Number mode (interprets fractional part as a number)
console.log(numberToAmharicWords(1250.75, { decimalMode: "number" }));
// => "አንድ ሺህ ሁለት መቶ ሃምሳ ነጥብ ሰባ አምስት"

// Preserving leading zeros in number mode (.05)
console.log(numberToAmharicWords(1250.05, { decimalMode: "number" }));
// => "አንድ ሺህ ሁለት መቶ ሃምሳ ነጥብ ዜሮ አምስት"

// Fixed precision rounding
console.log(numberToAmharicWords(12.3456, { decimalPrecision: 2 }));
// => "አስራ ሁለት ነጥብ ሦስት አምስት"

// Converting only the fractional component
console.log(
  decimalToAmharicWords(0.75, { includeIntegerPart: false })
);
// => "ሰባት አምስት"
