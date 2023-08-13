/**
 * Represents a location in a source code file.
 * @group Utilities
 */
export interface NodeLocation {
  path: string;
  line: number;
  char: number;
}

/**
 * Format a node location into a standard sting representation.
 *
 * @remarks
 * Starting with the following value:
 *
 * ```typescript
 * const location = {
 *   path: 'path/to/file.ts',
 *   line: 20,
 *   char: 53,
 * };
 * ```
 *
 * This will output: `path/to/file.ts:20:53`.
 *
 * @group Utilities
 */
export function formatLocation(location: NodeLocation): string {
  const { char, line, path } = location;
  return `${path}:${line}:${char}`;
}
