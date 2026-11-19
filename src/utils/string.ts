/**
 * Normalizes internal whitespace by trimming and collapsing multiple spaces into a single space.
 */
export function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, " ").trim();
}

/**
 * Attaches the Amharic preposition (typically "ከ") to a target phrase.
 * If target begins with a digit (e.g. "50/100" or "50"), a space is always kept.
 * If prefix is enabled and target begins with Fidel text, attaches directly (e.g. "ከ" + "ሃምሳ" -> "ከሃምሳ").
 * If prefix is disabled, separates with a space (e.g. "ከ ሃምሳ").
 */
export function attachAmharicPreposition(
  preposition: string,
  target: string,
  prefix = true
): string {
  const trimmedTarget = target.trim();
  if (!trimmedTarget) return "";
  const trimmedPrep = preposition.trim();
  if (!trimmedPrep) return trimmedTarget;

  // If the target starts with a digit, keep a space
  if (/^\d/.test(trimmedTarget) || !prefix) {
    return `${trimmedPrep} ${trimmedTarget}`;
  }

  return `${trimmedPrep}${trimmedTarget}`;
}
