export function slugify(text: string): string {
  return (
    text
      // convert camel-case
      .replace(/[a-z][A-Z]/g, (str) => str[0] + "-" + str[1])
      // replace one or more non-alphanumeric chars with a single dash
      .replace(/[^a-z0-9]+/gi, "-")
      // remove leading and trailing dashes
      .replace(/^-+|-+$/g, "")
      .toLowerCase()
  );
}
