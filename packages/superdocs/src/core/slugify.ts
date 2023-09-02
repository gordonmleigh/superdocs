/**
 * Generate a URL slug for the given text.
 *
 * @group Core
 */
export function slugify(text: string): string {
  return (
    text
      // replace one or more non-alphanumeric chars with a single dash
      .replace(/[^a-z0-9]+/gi, "-")
      // remove leading and trailing dashes
      .replace(/^-+|-+$/g, "")
  );
}
