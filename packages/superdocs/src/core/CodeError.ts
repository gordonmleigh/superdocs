import { NodeLocation } from "./NodeLocation";

function formatLocation({ char, line, path }: NodeLocation): string {
  return `${path}:${line}:${char}`;
}

export class CodeError extends Error {
  constructor(
    public readonly description: string,
    public readonly location: NodeLocation
  ) {
    super(`${formatLocation(location)}: ${description}`);
  }
}
