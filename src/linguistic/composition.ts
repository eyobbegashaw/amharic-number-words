import type { NumberToWordsOptions } from "../types/conversion.js";
import { normalizeWhitespace } from "../utils/string.js";
import {
  decomposeIntegerToGroups,
  formatScaleGroup,
} from "./group-rules.js";

/**
 * Converts a non-negative integer string into Amharic words.
 */
export function composeIntegerWords(
  integerString: string,
  options?: NumberToWordsOptions
): string {
  // Edge case: exactly 0
  if (integerString === "0" || integerString === "") {
    return "ዜሮ";
  }

  const groups = decomposeIntegerToGroups(integerString);

  // Groups are ordered from scale 0 up to highest scale; reverse to process from highest to lowest
  const parts: string[] = [];
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
    return "ዜሮ";
  }

  return normalizeWhitespace(parts.join(" "));
}

/**
 * Attaches the negative prefix to converted Amharic words if the value is negative.
 */
export function composeSignedWords(
  words: string,
  isNegative: boolean,
  options?: NumberToWordsOptions
): string {
  if (!isNegative) {
    return words;
  }
  const prefix = options?.negativePrefix ?? "አሉታዊ";
  return normalizeWhitespace(`${prefix} ${words}`);
}
