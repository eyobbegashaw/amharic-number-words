import type { CurrencyDefinition } from "../currency-types.js";

/**
 * Euro (EUR) definition in Amharic.
 * Major unit: ዩሮ (Euro)
 * Minor unit: ሴንት (Cent)
 */
export const EUR_CURRENCY: CurrencyDefinition = {
  code: "EUR",
  majorUnit: "ዩሮ",
  minorUnit: "ሴንት",
  decimals: 2,
  minorConnector: "ከ",
  majorPlacement: "after",
};

/**
 * British Pound (GBP) definition in Amharic.
 * Major unit: ፓውንድ (Pound)
 * Minor unit: ፔንስ (Pence)
 */
export const GBP_CURRENCY: CurrencyDefinition = {
  code: "GBP",
  majorUnit: "ፓውንድ",
  minorUnit: "ፔንስ",
  decimals: 2,
  minorConnector: "ከ",
  majorPlacement: "after",
};
