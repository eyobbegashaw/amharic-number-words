# Financial Software & Cheque-Writing Guide

This guide describes best practices for integrating `amharic-number-words` into Ethiopian financial institutions, core banking systems, ERPs, accounting software, and POS receipt printers.

---

## 1. Cheque Writing (`toChequeWords`)

In Ethiopian banking (Commercial Bank of Ethiopia, Awash Bank, Dashen Bank, etc.), cheques require strict textual representations to prevent alteration and fraud:

1. **Closing Suffix ("ብቻ")**:
   Always close the amount in words with **"ብቻ"** (*Only*).
   ```ts
   toChequeWords(1500);
   // "አንድ ሺህ አምስት መቶ ብር ብቻ"
   ```

2. **Zero Fractional Amounts**:
   Many Ethiopian banks prefer the fraction style for cents:
   ```ts
   toChequeWords(1500, { zeroMinorMode: "fraction" });
   // "አንድ ሺህ አምስት መቶ ብር ከ 00/100 ሳንቲም ብቻ"
   ```

3. **Fractional Amounts with Cents**:
   ```ts
   toChequeWords(1540.50);
   // "አንድ ሺህ አምስት መቶ አርባ ብር ከሃምሳ ሳንቲም ብቻ"
   ```

---

## 2. Invoicing and Receipts

For POS systems and tax invoices (compliant with Ethiopian Ministry of Revenues regulations):

```ts
import { formatAmountInAmharic } from "amharic-number-words";

// Invoice total with VAT
formatAmountInAmharic(1500, {
  currency: "ETB",
  style: "invoice",
});
// "ጠቅላላ ድምር፡ አንድ ሺህ አምስት መቶ ብር"

// POS Receipt
formatAmountInAmharic(350.25, {
  currency: "ETB",
  style: "receipt",
});
// "የተከፈለ መጠን፡ ሦስት መቶ ሃምሳ ብር ከሃያ አምስት ሳንቲም"
```

---

## 3. Decimal Precision and Financial Safety

Never use floating-point numbers directly for financial calculations when string amounts are available. Pass numeric strings directly:

```ts
// Safe against floating-point precision loss
currencyToAmharicWords("125000000.75", { currency: "ETB" });
```
