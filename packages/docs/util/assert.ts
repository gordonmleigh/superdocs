export function assert(cond: unknown, message = 'assert error'): asserts cond {
  if (!cond) {
    throw new Error(message);
  }
}
