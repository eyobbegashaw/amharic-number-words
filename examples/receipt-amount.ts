import { formatAmountInAmharic } from "../src/index.js";

// POS receipt amount
const receiptAmount = 375.5;

const receiptWords = formatAmountInAmharic(receiptAmount, {
  currency: "ETB",
  style: "receipt",
});

console.log("=== POS RECEIPT ===");
console.log(`Amount: ${receiptAmount.toFixed(2)} ETB`);
console.log(`In Words: ${receiptWords}`);
// Output: "የተከፈለ መጠን፡ ሦስት መቶ ሰባ አምስት ብር ከሃምሳ ሳንቲም"
