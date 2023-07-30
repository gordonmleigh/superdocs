export function serverContext<T>(
  name: string,
): [() => T | undefined, (value: T) => void] {
  const symbol = `__serverContext__${name}`;
  return [
    () => (global as any)[symbol],
    (value) => {
      (global as any)[symbol] = value;
    },
  ];
}
