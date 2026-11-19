import { numberToAmharicWords } from "../src/index.js";

// Basic integers
console.log(numberToAmharicWords(0));
// => "ዜሮ"

console.log(numberToAmharicWords(15));
// => "አስራ አምስት"

console.log(numberToAmharicWords(100));
// => "አንድ መቶ"

console.log(numberToAmharicWords(101));
// => "አንድ መቶ አንድ"

console.log(numberToAmharicWords(1500));
// => "አንድ ሺህ አምስት መቶ"

console.log(numberToAmharicWords(2500000));
// => "ሁለት ሚሊዮን አምስት መቶ ሺህ"

console.log(numberToAmharicWords(1000000000));
// => "አንድ ቢሊዮን"

// Negative integers
console.log(numberToAmharicWords(-45));
// => "አሉታዊ አርባ አምስት"

console.log(numberToAmharicWords(-1500, { negativePrefix: "ሲቀነስ" }));
// => "ሲቀነስ አንድ ሺህ አምስት መቶ"

// Modern spelling variant
console.log(numberToAmharicWords(333, { sostSpelling: "ሶስት" }));
// => "ሶስት መቶ ሰላሳ ሶስት"
