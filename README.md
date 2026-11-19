# amharic-number-words

[![npm version](https://img.shields.io/npm/v/amharic-number-words.svg)](https://www.npmjs.com/package/amharic-number-words)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](https://www.npmjs.com/package/amharic-number-words)
[![Test Coverage](https://img.shields.io/badge/coverage->97%25-brightgreen.svg)]()

> Production-ready, enterprise-grade npm package that converts numeric values into grammatically correct Amharic words (ፊደል).
> Built for Ethiopian banking, accounting, invoicing, POS receipts, cheque-writing, and business management systems.

---

## Repository Name

**`amharic-number-words`**

GitHub Repository: `https://github.com/AI-based-Personal-Assistant/amharic-number-words`

---

## Features

- **Accurate Amharic Grammar**: Generates natural Amharic Fidel numbers rather than transliterated English or crude digit-by-digit translations.
- **Large Range Support**: Converts numbers from zero up to decillions ($10^{33}$) and beyond using arbitrary-precision safe string/BigInt decomposition.
- **Financial & Banking Ready**: Dedicated Ethiopian Birr (ETB) and currency conversions with proper major (`ብር`) and minor (`ሳንቲም`) units.
- **Bank Cheque Writing (`toChequeWords`)**: Adds standard Ethiopian banking security phrases (`"ብቻ"` / *Only*) and supports fractional cent notation (`00/100`).
- **POS & Invoicing (`formatAmountInAmharic`)**: Built-in formatters for sales receipts, tax invoices, and payment summaries.
- **Decimal Modes**: Configurable fractional formatting (`digits` vs `number` mode) with exact decimal precision and no floating-point rounding errors.
- **Orthography Preferences**: Customization for traditional vs. modern spellings (e.g. `ሦስት` vs `ሶስት`, `አስር` vs `ዐስር`, `ሃምሳ` vs `አምሳ`, `ሺህ` vs `ሺ`).
- **Framework Agnostic**: Works seamlessly in Node.js, Next.js, React, Vue, Angular, Bun, Deno, and standard web browsers.
- **TypeScript First**: Written in strict TypeScript with comprehensive type definitions, auto-complete, and dual ESM/CJS exports.
- **Zero Runtime Dependencies**: 100% self-contained with no external dependencies and tiny bundle footprint.

---

## Installation

```bash
npm install amharic-number-words
```

Or using other package managers:

```bash
# pnpm
pnpm add amharic-number-words

# yarn
yarn add amharic-number-words

# bun
bun add amharic-number-words
```

---

## Quick Start

### ES Modules (TypeScript / Modern JS)

```ts
import {
  numberToAmharicWords,
  currencyToAmharicWords,
  toChequeWords,
  formatAmountInAmharic,
} from "amharic-number-words";

// Basic number conversion
numberToAmharicWords(1500);
// => "አንድ ሺህ አምስት መቶ"

// Ethiopian Birr with Santim
currencyToAmharicWords(1540.50, { currency: "ETB" });
// => "አንድ ሺህ አምስት መቶ አርባ ብር ከሃምሳ ሳንቲም"

// Ethiopian Bank Cheque writing
toChequeWords(1500);
// => "አንድ ሺህ አምስት መቶ ብር ብቻ"

// Receipt and Invoice formatting
formatAmountInAmharic(25000, {
  currency: "ETB",
  style: "invoice",
});
// => "ጠቅላላ ድምር፡ ሃያ አምስት ሺህ ብር"
```

### CommonJS (Node.js)

```javascript
const {
  numberToAmharicWords,
  currencyToAmharicWords,
  toChequeWords,
} = require("amharic-number-words");

console.log(numberToAmharicWords(1500));
// "አንድ ሺህ አምስት መቶ"
```

---

## Core API Reference

### `numberToAmharicWords(value, options?)`

Converts a number, numeric string, or `bigint` into Amharic words.

```ts
numberToAmharicWords(0);
// "ዜሮ"

numberToAmharicWords(15);
// "አስራ አምስት"

numberToAmharicWords(100);
// "አንድ መቶ"

numberToAmharicWords(101);
// "አንድ መቶ አንድ"

numberToAmharicWords(1500);
// "አንድ ሺህ አምስት መቶ"

numberToAmharicWords(2500000);
// "ሁለት ሚሊዮን አምስት መቶ ሺህ"

numberToAmharicWords(1000000000);
// "አንድ ቢሊዮን"

numberToAmharicWords(-45);
// "አሉታዊ አርባ አምስት"
```

---

### `currencyToAmharicWords(value, options?)`

Converts a monetary amount into words with currency units. Defaults to Ethiopian Birr (`ETB`).

```ts
// Whole amount
currencyToAmharicWords(1500);
// "አንድ ሺህ አምስት መቶ ብር"

// Amount with cents / santim
currencyToAmharicWords(1500.50);
// "አንድ ሺህ አምስት መቶ ብር ከሃምሳ ሳንቲም"

// Fractional amount without whole Birr
currencyToAmharicWords(0.75);
// "ሰባ አምስት ሳንቲም"

// US Dollar
currencyToAmharicWords(100.25, { currency: "USD" });
// "አንድ መቶ ዶላር ከሃያ አምስት ሴንት"
```

---

### `toChequeWords(value, options?)`

Formats financial amounts according to Ethiopian bank cheque conventions. Appends security closing word `"ብቻ"` (*Only*) to prevent fraud.

```ts
// Standard cheque
toChequeWords(1500);
// "አንድ ሺህ አምስት መቶ ብር ብቻ"

// Cheque with cents
toChequeWords(1540.50);
// "አንድ ሺህ አምስት መቶ አርባ ብር ከሃምሳ ሳንቲም ብቻ"

// Banking fraction mode for zero cents
toChequeWords(1500, { zeroMinorMode: "fraction" });
// "አንድ ሺህ አምስት መቶ ብር ከ 00/100 ሳንቲም ብቻ"

// Banking fraction mode for non-zero cents
toChequeWords(1540.50, { minorFormat: "fraction" });
// "አንድ ሺህ አምስት መቶ አርባ ብር ከ 50/100 ሳንቲም ብቻ"
```

---

### `formatAmountInAmharic(value, options?)`

Formats financial amounts across business document presentation styles.

| Style | Example Output | Description |
|:------|:---------------|:------------|
| `"plain"` | `አንድ ሺህ አምስት መቶ` | Raw number in words |
| `"currency"` | `አንድ ሺህ አምስት መቶ ብር` | Number with currency |
| `"cheque"` | `አንድ ሺህ አምስት መቶ ብር ብቻ` | Cheque format with closing phrase |
| `"receipt"` | `የተከፈለ መጠን፡ አንድ ሺህ አምስት መቶ ብር` | POS receipt layout |
| `"invoice"` | `ጠቅላላ ድምር፡ አንድ ሺህ አምስት መቶ ብር` | Invoice total layout |

```ts
formatAmountInAmharic(1500, {
  currency: "ETB",
  style: "receipt",
});
// "የተከፈለ መጠን፡ አንድ ሺህ አምስት መቶ ብር"

formatAmountInAmharic(1500, {
  currency: "ETB",
  style: "invoice",
  customLabel: "የክፍያው ጠቅላላ ድምር በፊደል፡",
});
// "የክፍያው ጠቅላላ ድምር በፊደል፡ አንድ ሺህ አምስት መቶ ብር"
```

---

## Decimal Modes

Decimals can be read either digit-by-digit or as full numbers:

```ts
// Digits mode (default: spells out each digit individually)
numberToAmharicWords(1250.75, { decimalMode: "digits" });
// "አንድ ሺህ ሁለት መቶ ሃምሳ ነጥብ ሰባት አምስት"

// Number mode (interprets fractional digits as a number)
numberToAmharicWords(1250.75, { decimalMode: "number" });
// "አንድ ሺህ ሁለት መቶ ሃምሳ ነጥብ ሰባ አምስት"

// Fixed precision rounding
numberToAmharicWords(12.3456, { decimalPrecision: 2 });
// "አስራ ሁለት ነጥብ ሦስት አምስት"
```

---

## Linguistic Customization Options

Customize spelling and orthography to match your application's regional or editorial preferences:

```ts
numberToAmharicWords(333, {
  // Spelling for 3: "ሦስት" (traditional, default) | "ሶስት" (modern)
  sostSpelling: "ሶስት",

  // Spelling for 10: "አስር" (modern, default) | "ዐስር" (classical)
  asirSpelling: "አስር",

  // Spelling for 50: "ሃምሳ" (standard, default) | "አምሳ" (colloquial)
  hamsaSpelling: "ሃምሳ",

  // Spelling for 1,000: "ሺህ" (formal, default) | "ሺ" (informal)
  shihSpelling: "ሺህ",

  // Whether to prefix 100 with "አንድ": true ("አንድ መቶ", default) | false ("መቶ")
  leadingOneHundred: true,

  // Negative prefix: "አሉታዊ" (default) | "ኔጌቲቭ" | "ሲቀነስ"
  negativePrefix: "አሉታዊ",
});
```

---

## Custom Currency Registration

Register custom currencies globally or pass them inline:

```ts
import { registerCurrency, currencyToAmharicWords } from "amharic-number-words";

// 1. Register globally
registerCurrency({
  code: "AED",
  majorUnit: "ዲርሃም",
  minorUnit: "ፊልስ",
  decimals: 2,
  minorConnector: "ከ",
});

currencyToAmharicWords(450.50, { currency: "AED" });
// "አራት መቶ ሃምሳ ዲርሃም ከሃምሳ ፊልስ"

// 2. Or pass definition inline
currencyToAmharicWords(1200.75, {
  currency: {
    code: "SAR",
    majorUnit: "ሪያል",
    minorUnit: "ሃላላ",
    decimals: 2,
  },
});
// "አንድ ሺህ ሁለት መቶ ሪያል ከሰባ አምስት ሃላላ"
```

---

## Error Handling

All library errors inherit from `AmharicNumberError`:

```ts
import {
  numberToAmharicWords,
  InvalidNumberError,
  NumberOutOfRangeError,
  UnsupportedCurrencyError,
} from "amharic-number-words";

try {
  numberToAmharicWords("invalid-string");
} catch (error) {
  if (error instanceof InvalidNumberError) {
    console.error(`Invalid number input: ${error.message} (code: ${error.code})`);
  }
}
```

---

## Testing & Verification

The package comes with comprehensive test coverage:

```bash
# Run test suite
npm test

# Run tests with coverage report
npm run test:coverage

# Run TypeScript type check
npm run typecheck

# Build bundle
npm run build
```

---

## License

MIT © Antigravity Engineering
