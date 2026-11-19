import type { CurrencyDefinition } from "../currency-types.js";

/**
 * United States Dollar (USD) definition in Amharic.
 * Major unit: ዶላር (Dollar)
 * Minor unit: ሴንት (Cent)
 */
export const USD_CURRENCY: CurrencyDefinition = {
  code: "USD",
  majorUnit: "ዶላር",
  minorUnit: "ሴንት",
  decimals: 2,
  minorConnector: "ከ",
  majorPlacement: "after",
};
