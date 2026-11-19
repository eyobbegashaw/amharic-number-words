// src/validation/errors.ts
var AmharicNumberError = class extends Error {
  code;
  constructor(message, code = "AMHARIC_NUMBER_ERROR") {
    super(message);
    this.name = "AmharicNumberError";
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
};
var InvalidNumberError = class extends AmharicNumberError {
  constructor(message, details) {
    super(message, "INVALID_NUMBER");
    this.name = "InvalidNumberError";
    if (details !== void 0) {
      this.details = details;
    }
  }
};
var NumberOutOfRangeError = class extends AmharicNumberError {
  constructor(message) {
    super(message, "NUMBER_OUT_OF_RANGE");
    this.name = "NumberOutOfRangeError";
  }
};
var UnsupportedCurrencyError = class extends AmharicNumberError {
  currencyCode;
  constructor(currencyCode) {
    super(
      `Unsupported currency "${currencyCode}". Register it first via registerCurrency().`,
      "UNSUPPORTED_CURRENCY"
    );
    this.name = "UnsupportedCurrencyError";
    this.currencyCode = currencyCode;
  }
};
var ConfigurationError = class extends AmharicNumberError {
  constructor(message) {
    super(message, "CONFIGURATION_ERROR");
    this.name = "ConfigurationError";
  }
};

// src/utils/decimal.ts
function expandScientificNotation(str) {
  const match = str.match(/^([+-]?\d+(?:\.\d+)?)[eE][+]?(-?\d+)$/);
  if (!match || !match[1] || !match[2]) return str;
  const coefficient = match[1];
  const exponent = parseInt(match[2], 10);
  const parts = coefficient.split(".");
  const intPart = parts[0] ?? "";
  const sign = intPart.startsWith("-") ? "-" : intPart.startsWith("+") ? "+" : "";
  const rawInt = sign ? intPart.slice(1) : intPart;
  const rawDec = parts[1] ?? "";
  if (exponent === 0) {
    return sign + rawInt + (rawDec ? "." + rawDec : "");
  }
  if (exponent > 0) {
    if (exponent >= rawDec.length) {
      return sign + rawInt + rawDec + "0".repeat(exponent - rawDec.length);
    }
    return sign + rawInt + rawDec.slice(0, exponent) + "." + rawDec.slice(exponent);
  } else {
    const absExp = Math.abs(exponent);
    const combined = rawInt + rawDec;
    return sign + "0." + "0".repeat(absExp - 1) + combined;
  }
}
function parseNumericInput(value, options = {}) {
  const { strict = true } = options;
  if (value === null || value === void 0) {
    throw new InvalidNumberError("Value cannot be null or undefined.");
  }
  let raw;
  if (typeof value === "bigint") {
    raw = value.toString();
  } else if (typeof value === "number") {
    if (Number.isNaN(value)) {
      throw new InvalidNumberError("Value cannot be NaN.");
    }
    if (!Number.isFinite(value)) {
      throw new InvalidNumberError("Value must be a finite number.");
    }
    raw = value.toString();
  } else if (typeof value === "string") {
    raw = value.trim();
    if (raw === "") {
      throw new InvalidNumberError("Value cannot be an empty string.");
    }
    raw = raw.replace(/[_,]/g, "");
  } else {
    throw new InvalidNumberError(
      `Unsupported input type "${typeof value}". Expected number, string, or bigint.`
    );
  }
  if (raw.toLowerCase().includes("e")) {
    raw = expandScientificNotation(raw);
  }
  const validNumericRegex = /^[+-]?(?:\d+\.?\d*|\.\d+)$/;
  if (!validNumericRegex.test(raw)) {
    if (strict) {
      throw new InvalidNumberError(`Invalid numeric string "${raw}".`);
    }
  }
  let isNegative = false;
  let body = raw;
  if (body.startsWith("-")) {
    isNegative = true;
    body = body.slice(1);
  } else if (body.startsWith("+")) {
    body = body.slice(1);
  }
  const dotIndex = body.indexOf(".");
  let integerPart = "";
  let fractionalPart = null;
  if (dotIndex !== -1) {
    integerPart = body.slice(0, dotIndex);
    fractionalPart = body.slice(dotIndex + 1);
  } else {
    integerPart = body;
    fractionalPart = null;
  }
  if (!integerPart) {
    integerPart = "0";
  } else {
    integerPart = integerPart.replace(/^0+/, "");
    if (!integerPart) {
      integerPart = "0";
    }
  }
  if (fractionalPart !== null && fractionalPart.length === 0) {
    fractionalPart = null;
  }
  const isFractionAllZeros = fractionalPart === null || /^0+$/.test(fractionalPart);
  if (integerPart === "0" && isFractionAllZeros) {
    isNegative = false;
  }
  if (integerPart.length > 100) {
    throw new NumberOutOfRangeError(
      `Number magnitude exceeds maximum supported digits (${integerPart.length} > 100).`
    );
  }
  return {
    isNegative,
    integerPart,
    fractionalPart,
    originalInput: value
  };
}
function roundToPrecision(integerPart, fractionalPart, precision) {
  if (precision < 0) {
    throw new InvalidNumberError("Decimal precision cannot be negative.");
  }
  if (!fractionalPart) {
    return {
      integerPart,
      fractionalPart: precision > 0 ? "0".repeat(precision) : null
    };
  }
  if (precision === 0) {
    const firstDigit = parseInt(fractionalPart[0] ?? "0", 10);
    if (firstDigit >= 5) {
      const incremented = (BigInt(integerPart) + 1n).toString();
      return { integerPart: incremented, fractionalPart: null };
    }
    return { integerPart, fractionalPart: null };
  }
  if (fractionalPart.length <= precision) {
    return {
      integerPart,
      fractionalPart: fractionalPart.padEnd(precision, "0")
    };
  }
  const kept = fractionalPart.slice(0, precision);
  const nextDigit = parseInt(fractionalPart[precision] ?? "0", 10);
  if (nextDigit >= 5) {
    const roundedFraction = BigInt(kept) + 1n;
    const roundedStr = roundedFraction.toString().padStart(precision, "0");
    if (roundedStr.length > precision) {
      const incrementedInt = (BigInt(integerPart) + 1n).toString();
      return {
        integerPart: incrementedInt,
        fractionalPart: roundedStr.slice(1)
      };
    }
    return { integerPart, fractionalPart: roundedStr };
  }
  return { integerPart, fractionalPart: kept };
}

// src/validation/input-validator.ts
function isSupportedNumber(value) {
  if (value === null || value === void 0) {
    return false;
  }
  if (typeof value !== "number" && typeof value !== "bigint" && typeof value !== "string") {
    return false;
  }
  try {
    parseNumericInput(value, { strict: true });
    return true;
  } catch {
    return false;
  }
}
function validateNumberInput(value, options = {}) {
  if (value === null || value === void 0) {
    throw new InvalidNumberError("Value cannot be null or undefined.");
  }
  if (typeof value !== "number" && typeof value !== "bigint" && typeof value !== "string") {
    throw new InvalidNumberError(
      `Unsupported input type "${typeof value}". Expected number, string, or bigint.`
    );
  }
  return parseNumericInput(value, options);
}

// src/linguistic/number-words.ts
function getUnitWord(digit, options) {
  const sost = options?.sostSpelling ?? "\u1226\u1235\u1275";
  switch (digit) {
    case 0:
      return "\u12DC\u122E";
    case 1:
      return "\u12A0\u1295\u12F5";
    case 2:
      return "\u1201\u1208\u1275";
    case 3:
      return sost;
    case 4:
      return "\u12A0\u122B\u1275";
    case 5:
      return "\u12A0\u121D\u1235\u1275";
    case 6:
      return "\u1235\u12F5\u1235\u1275";
    case 7:
      return "\u1230\u1263\u1275";
    case 8:
      return "\u1235\u121D\u1295\u1275";
    case 9:
      return "\u12D8\u1320\u129D";
    default:
      return "";
  }
}
function getTeenWord(value, options) {
  const asir = options?.asirSpelling ?? "\u12A0\u1235\u122D";
  const sost = options?.sostSpelling ?? "\u1226\u1235\u1275";
  if (value === 10) {
    return asir;
  }
  const prefix = "\u12A0\u1235\u122B";
  switch (value) {
    case 11:
      return `${prefix} \u12A0\u1295\u12F5`;
    case 12:
      return `${prefix} \u1201\u1208\u1275`;
    case 13:
      return `${prefix} ${sost}`;
    case 14:
      return `${prefix} \u12A0\u122B\u1275`;
    case 15:
      return `${prefix} \u12A0\u121D\u1235\u1275`;
    case 16:
      return `${prefix} \u1235\u12F5\u1235\u1275`;
    case 17:
      return `${prefix} \u1230\u1263\u1275`;
    case 18:
      return `${prefix} \u1235\u121D\u1295\u1275`;
    case 19:
      return `${prefix} \u12D8\u1320\u129D`;
    default:
      return "";
  }
}
function getTenMultipleWord(value, options) {
  const hamsa = options?.hamsaSpelling ?? "\u1203\u121D\u1233";
  switch (value) {
    case 20:
      return "\u1203\u12EB";
    case 30:
      return "\u1230\u120B\u1233";
    case 40:
      return "\u12A0\u122D\u1263";
    case 50:
      return hamsa;
    case 60:
      return "\u1235\u12F5\u1233";
    case 70:
      return "\u1230\u1263";
    case 80:
      return "\u1230\u121B\u1295\u12EB";
    case 90:
      return "\u12D8\u1320\u1293";
    default:
      return "";
  }
}
var SCALE_NAMES = [
  "",
  // 10^0 (units)
  "\u123A\u1205",
  // 10^3 (thousands)
  "\u121A\u120A\u12EE\u1295",
  // 10^6 (millions)
  "\u1262\u120A\u12EE\u1295",
  // 10^9 (billions)
  "\u1275\u122A\u120A\u12EE\u1295",
  // 10^12 (trillions)
  "\u12B3\u12F5\u122A\u120A\u12EE\u1295",
  // 10^15 (quadrillions)
  "\u12A9\u12ED\u1295\u1272\u120A\u12EE\u1295",
  // 10^18 (quintillions)
  "\u1234\u12AD\u1235\u1272\u120A\u12EE\u1295",
  // 10^21 (sextillions)
  "\u1234\u1355\u1272\u120A\u12EE\u1295",
  // 10^24 (septillions)
  "\u12A6\u12AD\u1272\u120A\u12EE\u1295",
  // 10^27 (octillions)
  "\u1296\u1292\u120A\u12EE\u1295",
  // 10^30 (nonillions)
  "\u12F4\u1232\u120A\u12EE\u1295"
  // 10^33 (decillions)
];
function getScaleWord(index, options) {
  if (index === 1 && options?.shihSpelling === "\u123A") {
    return "\u123A";
  }
  return SCALE_NAMES[index] ?? "";
}

// src/utils/string.ts
function normalizeWhitespace(str) {
  return str.replace(/\s+/g, " ").trim();
}
function attachAmharicPreposition(preposition, target, prefix = true) {
  const trimmedTarget = target.trim();
  if (!trimmedTarget) return "";
  const trimmedPrep = preposition.trim();
  if (!trimmedPrep) return trimmedTarget;
  if (/^\d/.test(trimmedTarget) || !prefix) {
    return `${trimmedPrep} ${trimmedTarget}`;
  }
  return `${trimmedPrep}${trimmedTarget}`;
}

// src/linguistic/grammar-rules.ts
function convertTwoDigitNumber(value, options, isStandalone = true) {
  if (value === 0) {
    return isStandalone ? getUnitWord(0, options) : "";
  }
  if (value < 10) {
    return getUnitWord(value, options);
  }
  if (value < 20) {
    return getTeenWord(value, options);
  }
  const tens = Math.floor(value / 10) * 10;
  const unit = value % 10;
  const tensWord = getTenMultipleWord(tens, options);
  if (unit === 0) {
    return tensWord;
  }
  const unitWord = getUnitWord(unit, options);
  return `${tensWord} ${unitWord}`;
}
function convertThreeDigitGroup(value, options, isStandalone = true) {
  if (value === 0) {
    return isStandalone ? getUnitWord(0, options) : "";
  }
  const hundreds = Math.floor(value / 100);
  const remainder = value % 100;
  let hundredsPart = "";
  if (hundreds > 0) {
    if (hundreds === 1) {
      const leadingOne = options?.leadingOneHundred ?? true;
      hundredsPart = leadingOne ? "\u12A0\u1295\u12F5 \u1218\u1276" : "\u1218\u1276";
    } else {
      hundredsPart = `${getUnitWord(hundreds, options)} \u1218\u1276`;
    }
  }
  const remainderPart = remainder > 0 ? convertTwoDigitNumber(remainder, options, hundreds === 0 && isStandalone) : "";
  if (hundredsPart && remainderPart) {
    return `${hundredsPart} ${remainderPart}`;
  }
  return hundredsPart || remainderPart;
}

// src/linguistic/group-rules.ts
function decomposeIntegerToGroups(integerString) {
  const groups = [];
  const len = integerString.length;
  let scaleIndex = 0;
  for (let i = len; i > 0; i -= 3) {
    const start = Math.max(0, i - 3);
    const chunk = integerString.slice(start, i);
    const value = parseInt(chunk, 10);
    groups.push({
      index: scaleIndex,
      value,
      rawString: chunk
    });
    scaleIndex++;
  }
  return groups;
}
function formatScaleGroup(group, options) {
  if (group.value === 0) {
    return "";
  }
  const { index, value } = group;
  if (index >= SCALE_NAMES.length) {
    throw new NumberOutOfRangeError(
      `Number scale ${index * 3} exceeds maximum supported scale (${(SCALE_NAMES.length - 1) * 3}).`
    );
  }
  if (index === 0) {
    return convertThreeDigitGroup(value, options, false);
  }
  const scaleWord = getScaleWord(index, options);
  if (value === 1) {
    if (index === 1) {
      const leadingOne = options?.leadingOneThousand ?? true;
      return leadingOne ? `\u12A0\u1295\u12F5 ${scaleWord}` : scaleWord;
    }
    return `\u12A0\u1295\u12F5 ${scaleWord}`;
  }
  const groupWords = convertThreeDigitGroup(value, options, false);
  return `${groupWords} ${scaleWord}`;
}

// src/linguistic/composition.ts
function composeIntegerWords(integerString, options) {
  if (integerString === "0" || integerString === "") {
    return "\u12DC\u122E";
  }
  const groups = decomposeIntegerToGroups(integerString);
  const parts = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const group = groups[i];
    if (group && group.value > 0) {
      const formatted = formatScaleGroup(group, options);
      if (formatted) {
        parts.push(formatted);
      }
    }
  }
  if (parts.length === 0) {
    return "\u12DC\u122E";
  }
  return normalizeWhitespace(parts.join(" "));
}
function composeSignedWords(words, isNegative, options) {
  if (!isNegative) {
    return words;
  }
  const prefix = options?.negativePrefix ?? "\u12A0\u1209\u1273\u12CA";
  return normalizeWhitespace(`${prefix} ${words}`);
}

// src/core/decimal-converter.ts
function convertFractionalPart(fractionalPart, options) {
  const mode = options?.decimalMode ?? "digits";
  if (mode === "digits") {
    const digitWords = [];
    for (const char of fractionalPart) {
      const digit = parseInt(char, 10);
      digitWords.push(getUnitWord(digit, options));
    }
    return digitWords.join(" ");
  }
  const leadingZerosMatch = fractionalPart.match(/^0+/);
  const leadingZeroCount = leadingZerosMatch ? leadingZerosMatch[0].length : 0;
  const nonZeroFraction = fractionalPart.slice(leadingZeroCount);
  const words = [];
  if (leadingZeroCount > 0 && nonZeroFraction.length > 0) {
    for (let i = 0; i < leadingZeroCount; i++) {
      words.push("\u12DC\u122E");
    }
    words.push(composeIntegerWords(nonZeroFraction, options));
  } else if (nonZeroFraction.length === 0) {
    for (let i = 0; i < fractionalPart.length; i++) {
      words.push("\u12DC\u122E");
    }
  } else {
    words.push(composeIntegerWords(nonZeroFraction, options));
  }
  return words.join(" ");
}
function decimalToAmharicWords(value, options = {}) {
  const parsed = validateNumberInput(value, { strict: options.strict ?? true });
  let intPart = parsed.integerPart;
  let fracPart = parsed.fractionalPart;
  if (options.decimalPrecision !== void 0) {
    const rounded = roundToPrecision(intPart, fracPart, options.decimalPrecision);
    intPart = rounded.integerPart;
    fracPart = rounded.fractionalPart;
  }
  const pointWord = options.decimalPointWord ?? "\u1290\u1325\u1265";
  const includeInt = options.includeIntegerPart ?? true;
  if (fracPart === null || fracPart.length === 0) {
    if (!includeInt) {
      return "";
    }
    const intWords2 = composeIntegerWords(intPart, options);
    return composeSignedWords(intWords2, parsed.isNegative, options);
  }
  const fracWords = convertFractionalPart(fracPart, options);
  if (!includeInt) {
    return fracWords;
  }
  const intWords = composeIntegerWords(intPart, options);
  const fullText = `${intWords} ${pointWord} ${fracWords}`;
  return composeSignedWords(fullText, parsed.isNegative, options);
}

// src/core/number-converter.ts
function numberToAmharicWords(value, options = {}) {
  const parsed = validateNumberInput(value, { strict: options.strict ?? true });
  if (parsed.fractionalPart === null || /^0+$/.test(parsed.fractionalPart) || options.decimalPrecision === 0) {
    if (options.decimalPrecision === 0 && parsed.fractionalPart !== null) {
      const rounded = roundToPrecision(
        parsed.integerPart,
        parsed.fractionalPart,
        0
      );
      const words2 = composeIntegerWords(rounded.integerPart, options);
      return composeSignedWords(words2, parsed.isNegative, options);
    }
    const words = composeIntegerWords(parsed.integerPart, options);
    return composeSignedWords(words, parsed.isNegative, options);
  }
  return decimalToAmharicWords(value, options);
}

// src/core/integer-converter.ts
function integerToAmharicWords(value, options = {}) {
  const parsed = validateNumberInput(value, { strict: options.strict ?? true });
  const { strictInteger = true } = options;
  if (strictInteger && parsed.fractionalPart !== null && !/^0+$/.test(parsed.fractionalPart)) {
    throw new InvalidNumberError(
      `Expected an integer, but received fractional value "${value}".`
    );
  }
  const words = composeIntegerWords(parsed.integerPart, options);
  return composeSignedWords(words, parsed.isNegative, options);
}

// src/currency/currencies/etb.ts
var ETB_CURRENCY = {
  code: "ETB",
  majorUnit: "\u1265\u122D",
  minorUnit: "\u1233\u1295\u1272\u121D",
  decimals: 2,
  minorConnector: "\u12A8",
  majorPlacement: "after"
};

// src/currency/currencies/usd.ts
var USD_CURRENCY = {
  code: "USD",
  majorUnit: "\u12F6\u120B\u122D",
  minorUnit: "\u1234\u1295\u1275",
  decimals: 2,
  minorConnector: "\u12A8",
  majorPlacement: "after"
};

// src/currency/currencies/eur.ts
var EUR_CURRENCY = {
  code: "EUR",
  majorUnit: "\u12E9\u122E",
  minorUnit: "\u1234\u1295\u1275",
  decimals: 2,
  minorConnector: "\u12A8",
  majorPlacement: "after"
};
var GBP_CURRENCY = {
  code: "GBP",
  majorUnit: "\u1353\u12CD\u1295\u12F5",
  minorUnit: "\u1354\u1295\u1235",
  decimals: 2,
  minorConnector: "\u12A8",
  majorPlacement: "after"
};

// src/currency/currency-registry.ts
var DEFAULT_CURRENCIES = [
  ETB_CURRENCY,
  USD_CURRENCY,
  EUR_CURRENCY,
  GBP_CURRENCY
];
var registry = /* @__PURE__ */ new Map();
for (const curr of DEFAULT_CURRENCIES) {
  registry.set(curr.code.toUpperCase(), curr);
}
function registerCurrency(currency) {
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
    minorConnector: currency.minorConnector ?? "\u12A8",
    majorPlacement: currency.majorPlacement ?? "after"
  });
}
function hasCurrency(code) {
  return registry.has(code.toUpperCase());
}
function getCurrency(codeOrDefinition) {
  if (typeof codeOrDefinition === "object" && codeOrDefinition !== null) {
    if (!codeOrDefinition.code || !codeOrDefinition.majorUnit) {
      throw new ConfigurationError(
        "Invalid currency definition object provided."
      );
    }
    return {
      ...codeOrDefinition,
      code: codeOrDefinition.code.toUpperCase(),
      minorConnector: codeOrDefinition.minorConnector ?? "\u12A8",
      majorPlacement: codeOrDefinition.majorPlacement ?? "after"
    };
  }
  const code = String(codeOrDefinition).toUpperCase();
  const found = registry.get(code);
  if (!found) {
    throw new UnsupportedCurrencyError(code);
  }
  return found;
}
function resetCurrencyRegistry() {
  registry.clear();
  for (const curr of DEFAULT_CURRENCIES) {
    registry.set(curr.code.toUpperCase(), curr);
  }
}

// src/currency/currency-converter.ts
function currencyToAmharicWords(value, options = {}) {
  const currencyDef = getCurrency(options.currency ?? "ETB");
  const parsed = validateNumberInput(value, { strict: options.strict ?? true });
  const decimals = currencyDef.decimals;
  const rounded = roundToPrecision(
    parsed.integerPart,
    parsed.fractionalPart,
    decimals
  );
  const intPart = rounded.integerPart;
  const fracPart = rounded.fractionalPart ?? "0".repeat(decimals);
  const minorInt = decimals > 0 ? parseInt(fracPart, 10) : 0;
  const isMajorZero = intPart === "0";
  const isMinorZero = minorInt === 0;
  let majorPhrase = "";
  if (!isMajorZero || (options.showZeroMajor ?? false) || isMinorZero) {
    const intWords = composeIntegerWords(intPart, options);
    if (currencyDef.majorPlacement === "before") {
      majorPhrase = `${currencyDef.majorUnit} ${intWords}`;
    } else {
      majorPhrase = `${intWords} ${currencyDef.majorUnit}`;
    }
  }
  let minorPhrase = "";
  const minorFormat = options.minorFormat ?? "words";
  const zeroMinorMode = options.zeroMinorMode ?? "omit";
  const prefixPrep = options.prefixPreposition ?? true;
  const connector = currencyDef.minorConnector ?? "\u12A8";
  if (!isMinorZero) {
    let minorContent = "";
    if (minorFormat === "fraction") {
      const denom = Math.pow(10, decimals);
      minorContent = `${fracPart}/${denom} ${currencyDef.minorUnit}`;
    } else if (minorFormat === "digits") {
      minorContent = `${fracPart} ${currencyDef.minorUnit}`;
    } else {
      const minorWords = composeIntegerWords(minorInt.toString(), options);
      minorContent = `${minorWords} ${currencyDef.minorUnit}`;
    }
    if (majorPhrase) {
      minorPhrase = attachAmharicPreposition(connector, minorContent, prefixPrep);
    } else {
      minorPhrase = minorContent;
    }
  } else if (zeroMinorMode !== "omit" && decimals > 0) {
    let minorContent = "";
    if (zeroMinorMode === "fraction") {
      const denom = Math.pow(10, decimals);
      minorContent = `${"0".repeat(decimals)}/${denom} ${currencyDef.minorUnit}`;
    } else {
      minorContent = `\u12DC\u122E ${currencyDef.minorUnit}`;
    }
    if (majorPhrase) {
      minorPhrase = attachAmharicPreposition(connector, minorContent, prefixPrep);
    } else {
      minorPhrase = minorContent;
    }
  }
  const combined = majorPhrase && minorPhrase ? `${majorPhrase} ${minorPhrase}` : majorPhrase || minorPhrase;
  const normalized = normalizeWhitespace(combined);
  return composeSignedWords(normalized, parsed.isNegative, options);
}

// src/financial/cheque.ts
function toChequeWords(value, options = {}) {
  const currencyWords = currencyToAmharicWords(value, {
    currency: "ETB",
    ...options
  });
  const closing = options.closingPhrase ?? "\u1265\u127B";
  const prefix = options.prefixPhrase?.trim();
  let result = currencyWords;
  if (prefix) {
    result = `${prefix} ${result}`;
  }
  if (closing.trim()) {
    result = `${result} ${closing.trim()}`;
  }
  return normalizeWhitespace(result);
}

// src/financial/amount-formatter.ts
function amountToAmharicWords(value, options = {}) {
  if (options.currency) {
    return currencyToAmharicWords(value, options);
  }
  return numberToAmharicWords(value, options);
}
function formatAmountInAmharic(value, options = {}) {
  const style = options.style ?? "plain";
  switch (style) {
    case "plain":
      return numberToAmharicWords(value, options);
    case "cheque":
      return toChequeWords(value, options);
    case "currency":
      return currencyToAmharicWords(value, options);
    case "receipt": {
      const label = options.customLabel ?? "\u12E8\u1270\u12A8\u1348\u1208 \u1218\u1320\u1295\u1361";
      const words = currencyToAmharicWords(value, options);
      return normalizeWhitespace(`${label} ${words}`);
    }
    case "invoice": {
      const label = options.customLabel ?? "\u1320\u1245\u120B\u120B \u12F5\u121D\u122D\u1361";
      const words = currencyToAmharicWords(value, options);
      return normalizeWhitespace(`${label} ${words}`);
    }
    default:
      return currencyToAmharicWords(value, options);
  }
}

// src/types/options.ts
var DEFAULT_NUMBER_OPTIONS = {
  sostSpelling: "\u1226\u1235\u1275",
  asirSpelling: "\u12A0\u1235\u122D",
  hamsaSpelling: "\u1203\u121D\u1233",
  shihSpelling: "\u123A\u1205",
  leadingOneHundred: true,
  leadingOneThousand: true,
  decimalMode: "digits",
  decimalPointWord: "\u1290\u1325\u1265",
  negativePrefix: "\u12A0\u1209\u1273\u12CA",
  strict: true
};
var DEFAULT_CURRENCY_OPTIONS = {
  ...DEFAULT_NUMBER_OPTIONS,
  minorFormat: "words",
  zeroMinorMode: "omit",
  showZeroMajor: false,
  prefixPreposition: true
};
var DEFAULT_CHEQUE_OPTIONS = {
  ...DEFAULT_CURRENCY_OPTIONS,
  closingPhrase: "\u1265\u127B"
};

export { AmharicNumberError, ConfigurationError, DEFAULT_CHEQUE_OPTIONS, DEFAULT_CURRENCY_OPTIONS, DEFAULT_NUMBER_OPTIONS, ETB_CURRENCY, EUR_CURRENCY, GBP_CURRENCY, InvalidNumberError, NumberOutOfRangeError, USD_CURRENCY, UnsupportedCurrencyError, amountToAmharicWords, currencyToAmharicWords, decimalToAmharicWords, formatAmountInAmharic, getCurrency, hasCurrency, integerToAmharicWords, isSupportedNumber, numberToAmharicWords, registerCurrency, resetCurrencyRegistry, toChequeWords, validateNumberInput };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map