import type { CurrencyDefinition } from "./currency-types.js";
import {
  UnsupportedCurrencyError,
  ConfigurationError,
} from "../validation/errors.js";
import { ETB_CURRENCY } from "./currencies/etb.js";
import { USD_CURRENCY } from "./currencies/usd.js";
import { EUR_CURRENCY, GBP_CURRENCY } from "./currencies/eur.js";

const DEFAULT_CURRENCIES: ReadonlyArray<CurrencyDefinition> = [
  ETB_CURRENCY,
  USD_CURRENCY,
  EUR_CURRENCY,
  GBP_CURRENCY,
];

const registry = new Map<string, CurrencyDefinition>();

// Initialize default currencies
for (const curr of DEFAULT_CURRENCIES) {
  registry.set(curr.code.toUpperCase(), curr);
}

/**
 * Registers or overrides a currency definition.
 *
 * @param currency custom CurrencyDefinition
 */
export function registerCurrency(currency: CurrencyDefinition): void {
  if (!currency || typeof currency !== "object") {
    throw new ConfigurationError("Currency definition must be a valid object.");
  }
  if (!currency.code || typeof currency.code !== "string") {
    throw new ConfigurationError("Currency definition must have a valid code string.");
  }
  if (!currency.majorUnit || typeof currency.majorUnit !== "string") {
    throw new ConfigurationError("Currency definition must have a majorUnit string.");
  }
  if (typeof currency.decimals !== "number" || currency.decimals < 0) {
    throw new ConfigurationError(
      "Currency definition decimals must be a non-negative number."
    );
  }

  registry.set(currency.code.toUpperCase(), {
    ...currency,
    code: currency.code.toUpperCase(),
    minorConnector: currency.minorConnector ?? "ከ",
    majorPlacement: currency.majorPlacement ?? "after",
  });
}

/**
 * Checks whether a currency code is registered.
 */
export function hasCurrency(code: string): boolean {
  return registry.has(code.toUpperCase());
}

/**
 * Retrieves a currency definition by code or returns the definition directly if already an object.
 * Throws UnsupportedCurrencyError if not found.
 */
export function getCurrency(
  codeOrDefinition: string | CurrencyDefinition
): CurrencyDefinition {
  if (typeof codeOrDefinition === "object" && codeOrDefinition !== null) {
    if (!codeOrDefinition.code || !codeOrDefinition.majorUnit) {
      throw new ConfigurationError(
        "Invalid currency definition object provided."
      );
    }
    return {
      ...codeOrDefinition,
      code: codeOrDefinition.code.toUpperCase(),
      minorConnector: codeOrDefinition.minorConnector ?? "ከ",
      majorPlacement: codeOrDefinition.majorPlacement ?? "after",
    };
  }

  const code = String(codeOrDefinition).toUpperCase();
  const found = registry.get(code);

  if (!found) {
    throw new UnsupportedCurrencyError(code);
  }

  return found;
}

/**
 * Resets the registry back to its default currencies (ETB, USD, EUR, GBP).
 */
export function resetCurrencyRegistry(): void {
  registry.clear();
  for (const curr of DEFAULT_CURRENCIES) {
    registry.set(curr.code.toUpperCase(), curr);
  }
}
