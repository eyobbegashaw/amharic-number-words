const {
  numberToAmharicWords,
  currencyToAmharicWords,
  toChequeWords,
} = require("../dist/index.cjs");

console.log("=== Node.js CommonJS Example ===");
console.log("Number: 1500 =>", numberToAmharicWords(1500));
console.log("Currency: 1500.50 ETB =>", currencyToAmharicWords(1500.5));
console.log("Cheque: 1500 ETB =>", toChequeWords(1500));
