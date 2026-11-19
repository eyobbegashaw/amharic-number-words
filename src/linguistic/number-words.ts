import type {
  SostSpelling,
  AsirSpelling,
  HamsaSpelling,
  ShihSpelling,
} from "../types/conversion.js";

/**
 * Returns the Amharic word for a single digit 0-9.
 */
export function getUnitWord(
  digit: number,
  options?: { sostSpelling?: SostSpelling }
): string {
  const sost = options?.sostSpelling ?? "ሦስት";
  switch (digit) {
    case 0:
      return "ዜሮ";
    case 1:
      return "አንድ";
    case 2:
      return "ሁለት";
    case 3:
      return sost;
    case 4:
      return "አራት";
    case 5:
      return "አምስት";
    case 6:
      return "ስድስት";
    case 7:
      return "ሰባት";
    case 8:
      return "ስምንት";
    case 9:
      return "ዘጠኝ";
    default:
      return "";
  }
}

/**
 * Returns the Amharic word for numbers 10-19.
 */
export function getTeenWord(
  value: number,
  options?: { sostSpelling?: SostSpelling; asirSpelling?: AsirSpelling }
): string {
  const asir = options?.asirSpelling ?? "አስር";
  const sost = options?.sostSpelling ?? "ሦስት";

  if (value === 10) {
    return asir;
  }

  // Stems for 11-19 use the 4th order 'ራ' ("አስራ")
  const prefix = "አስራ";
  switch (value) {
    case 11:
      return `${prefix} አንድ`;
    case 12:
      return `${prefix} ሁለት`;
    case 13:
      return `${prefix} ${sost}`;
    case 14:
      return `${prefix} አራት`;
    case 15:
      return `${prefix} አምስት`;
    case 16:
      return `${prefix} ስድስት`;
    case 17:
      return `${prefix} ሰባት`;
    case 18:
      return `${prefix} ስምንት`;
    case 19:
      return `${prefix} ዘጠኝ`;
    default:
      return "";
  }
}

/**
 * Returns the Amharic word for multiples of 10 from 20-90.
 */
export function getTenMultipleWord(
  value: number,
  options?: { hamsaSpelling?: HamsaSpelling }
): string {
  const hamsa = options?.hamsaSpelling ?? "ሃምሳ";
  switch (value) {
    case 20:
      return "ሃያ";
    case 30:
      return "ሰላሳ";
    case 40:
      return "አርባ";
    case 50:
      return hamsa;
    case 60:
      return "ስድሳ";
    case 70:
      return "ሰባ";
    case 80:
      return "ሰማንያ";
    case 90:
      return "ዘጠና";
    default:
      return "";
  }
}

/**
 * Scale names in Amharic based on 1000^n (short scale).
 */
export const SCALE_NAMES: readonly string[] = [
  "", // 10^0 (units)
  "ሺህ", // 10^3 (thousands)
  "ሚሊዮን", // 10^6 (millions)
  "ቢሊዮን", // 10^9 (billions)
  "ትሪሊዮን", // 10^12 (trillions)
  "ኳድሪሊዮን", // 10^15 (quadrillions)
  "ኩይንቲሊዮን", // 10^18 (quintillions)
  "ሴክስቲሊዮን", // 10^21 (sextillions)
  "ሴፕቲሊዮን", // 10^24 (septillions)
  "ኦክቲሊዮን", // 10^27 (octillions)
  "ኖኒሊዮን", // 10^30 (nonillions)
  "ዴሲሊዮን", // 10^33 (decillions)
];

/**
 * Returns the scale name for a given scale index (0 = units, 1 = thousands, 2 = millions, etc.).
 */
export function getScaleWord(
  index: number,
  options?: { shihSpelling?: ShihSpelling }
): string {
  if (index === 1 && options?.shihSpelling === "ሺ") {
    return "ሺ";
  }
  return SCALE_NAMES[index] ?? "";
}
