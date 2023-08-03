import { BinaryLike, BinaryToTextEncoding, createHash } from "crypto";

export interface HashOptions {
  algorithm?: string;
  digest?: BinaryToTextEncoding;
}

export function hash(
  data: (string | BinaryLike)[],
  { algorithm = "sha1", digest = "hex" }: HashOptions = {},
): string {
  const hash = createHash(algorithm);
  for (const part of data) {
    hash.update(part);
  }
  return hash.digest(digest);
}
