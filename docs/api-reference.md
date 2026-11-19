# API Reference — `amharic-number-words`

The `amharic-number-words` package provides a robust, strongly typed TypeScript API designed for high-precision number, decimal, currency, invoice, receipt, and cheque conversions into natural Amharic words (ፊደል).

---

## Table of Contents

- [Core Conversion Functions](#core-conversion-functions)
  - [`numberToAmharicWords(value, options?)`](#numbertoamharicwordsvalue-options)
  - [`integerToAmharicWords(value, options?)`](#integertoamharicwordsvalue-options)
  - [`decimalToAmharicWords(value, options?)`](#decimaltoamharicwordsvalue-options)
- [Financial and Business Functions](#financial-and-business-functions)
  - [`amountToAmharicWords(value, options?)`](#amounttoamharicwordsvalue-options)
  - [`currencyToAmharicWords(value, options?)`](#currencytoamharicwordsvalue-options)
  - [`toChequeWords(value, options?)`](#tochequewordsvalue-options)
  - [`formatAmountInAmharic(value, options?)`](#formatamountinamharicvalue-options)
- [Currency Registry](#currency-registry)
  - [`registerCurrency(currency)`](#registercurrencycurrency)
  - [`getCurrency(codeOrDefinition)`](#getcurrencycodeordefinition)
  - [`hasCurrency(code)`](#hascurrencycode)
  - [`resetCurrencyRegistry()`](#resetcurrencyregistry)
- [Validation and Type Checking](#validation-and-type-checking)
  - [`isSupportedNumber(value)`](#issupportednumbervalue)
  - [`validateNumberInput(value, options?)`](#validatenumberinputvalue-options)
- [Errors](#errors)
- [Types and Options](#types-and-options)

---

## Core Conversion Functions

### `numberToAmharicWords(value, options?)`

Converts any valid integer, decimal, negative number, or BigInt into grammatically correct Amharic words.

```ts
function numberToAmharicWords(
  value: number | string | bigint,
  options?: NumberToWordsOptions
): string;
```

#### Example

```ts
import { numberToAmharicWords } from "amharic-number-words";

numberToAmharicWords(0);
// "ዜሮ"

numberToAmharicWords(1500);
// "አንድ ሺህ አምስት መቶ"

numberToAmharicWords(1250.75);
// "አንድ ሺህ ሁለት መቶ ሃምሳ ነጥብ ሰባት አምስት"

numberToAmharicWords(-45);
// "አሉታዊ አርባ አምስት"
```

---

### `integerToAmharicWords(value, options?)`

Converts an integer into Amharic words. Throws `InvalidNumberError` if the value contains a non-zero fractional part and `strictInteger` is `true`.

```ts
function integerToAmharicWords(
  value: number | string | bigint,
  options?: IntegerOptions
): string;
```

#### Example

```ts
import { integerToAmharicWords } from "amharic-number-words";

integerToAmharicWords(1000000);
// "አንድ ሚሊዮን"

integerToAmharicWords(12.5);
// Throws InvalidNumberError: Expected an integer
```

---

### `decimalToAmharicWords(value, options?)`

Converts a decimal number into Amharic words. Supports formatting both the whole number and fractional parts, or only the fractional part.

```ts
function decimalToAmharicWords(
  value: number | string,
  options?: DecimalOptions
): string;
```

#### Example

```ts
import { decimalToAmharicWords } from "amharic-number-words";

decimalToAmharicWords(1250.75);
// "አንድ ሺህ ሁለት መቶ ሃምሳ ነጥብ ሰባት አምስት"

decimalToAmharicWords(1250.75, { decimalMode: "number" });
// "አንድ ሺህ ሁለት መቶ ሃምሳ ነጥብ ሰባ አምስት"

decimalToAmharicWords(0.75, { includeIntegerPart: false });
// "ሰባት አምስት"
```

---

## Financial and Business Functions

### `amountToAmharicWords(value, options?)`

Converts an amount into words. If no currency is passed, converts as a plain number; if currency is passed, adds currency units.

```ts
function amountToAmharicWords(
  value: number | string | bigint,
  options?: NumberToWordsOptions & { currency?: string }
): string;
```

---

### `currencyToAmharicWords(value, options?)`

Converts a monetary value into Amharic words with major and minor currency units (e.g., ብር and ሳንቲም for ETB).

```ts
function currencyToAmharicWords(
  value: number | string,
  options?: CurrencyOptions
): string;
```

#### Example

```ts
import { currencyToAmharicWords } from "amharic-number-words";

// Default currency is ETB
currencyToAmharicWords(1500);
// "አንድ ሺህ አምስት መቶ ብር"

currencyToAmharicWords(1500.5);
// "አንድ ሺህ አምስት መቶ ብር ከሃምሳ ሳንቲም"

currencyToAmharicWords(0.75);
// "ሰባ አምስት ሳንቲም"

currencyToAmharicWords(100.25, { currency: "USD" });
// "አንድ መቶ ዶላር ከሃያ አምስት ሴንት"
```

---

### `toChequeWords(value, options?)`

Generates bank-ready cheque wording with the standard Ethiopian security closing phrase `"ብቻ"` (Only) to prevent alteration.

```ts
function toChequeWords(
  value: number | string,
  options?: ChequeOptions
): string;
```

#### Example

```ts
import { toChequeWords } from "amharic-number-words";

toChequeWords(1500);
// "አንድ ሺህ አምስት መቶ ብር ብቻ"

toChequeWords(1540.5);
// "አንድ ሺህ አምስት መቶ አርባ ብር ከሃምሳ ሳንቲም ብቻ"

toChequeWords(1500, { zeroMinorMode: "fraction" });
// "አንድ ሺህ አምስት መቶ ብር ከ 00/100 ሳንቲም ብቻ"
```

---

### `formatAmountInAmharic(value, options?)`

Formats financial amounts across business document styles (`plain`, `currency`, `cheque`, `receipt`, `invoice`).

```ts
function formatAmountInAmharic(
  value: number | string,
  options?: FormatAmountOptions
): string;
```

#### Example

```ts
import { formatAmountInAmharic } from "amharic-number-words";

formatAmountInAmharic(1500, { style: "receipt", currency: "ETB" });
// "የተከፈለ መጠን፡ አንድ ሺህ አምስት መቶ ብር"

formatAmountInAmharic(1500, { style: "invoice", currency: "ETB" });
// "ጠቅላላ ድምር፡ አንድ ሺህ አምስት መቶ ብር"
```

---

## Currency Registry

```ts
import {
  registerCurrency,
  getCurrency,
  hasCurrency,
  resetCurrencyRegistry,
} from "amharic-number-words";

// Register custom currency
registerCurrency({
  code: "AED",
  majorUnit: "ዲርሃም",
  minorUnit: "ፊልስ",
  decimals: 2,
});
```

---

## Errors

All package errors inherit from `AmharicNumberError`:

- `AmharicNumberError`: Base error class with `.code`.
- `InvalidNumberError`: Thrown for `NaN`, `Infinity`, malformed strings, or unsupported types.
- `NumberOutOfRangeError`: Thrown when digits exceed maximum magnitude (> 100 digits or > $10^{36}$).
- `UnsupportedCurrencyError`: Thrown when an unregistered currency code is requested.
- `ConfigurationError`: Thrown when invalid configuration options are passed.
