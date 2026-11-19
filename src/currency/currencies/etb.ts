import type { CurrencyDefinition } from "../currency-types.js";

/**
 * Ethiopian Birr (ETB) definition.
 * Major unit: ብር (Birr)
 * Minor unit: ሳንቲም (Santim)
 */
export const ETB_CURRENCY: CurrencyDefinition = {
  code: "ETB",
  majorUnit: "ብር",
  minorUnit: "ሳንቲም",
  decimals: 2,
  minorConnector: "ከ",
  majorPlacement: "after",
};
