/**
 * Represents a location in a source code file.
 * @group Utilities
 */
export interface NodeLocation {
  path: string;
  line: number;
  char: number;
}
