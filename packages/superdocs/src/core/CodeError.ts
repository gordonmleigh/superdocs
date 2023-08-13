import { NodeLocation, formatLocation } from "./NodeLocation";

/**
 * An error thrown due to a syntax error or other issue with the code.
 * @group Utilities
 */
export class CodeError extends Error {
  constructor(
    public readonly description: string,
    public readonly location: NodeLocation,
  ) {
    super(`${formatLocation(location)}: ${description}`);
  }
}
