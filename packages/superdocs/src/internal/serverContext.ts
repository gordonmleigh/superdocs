export function serverContext<T>(
  initialValue: T,
  name?: string,
): [() => T, (v: T) => void] {
  // next is doing something weird with hot module reloading that interferes
  // with singletons not explicitly attached to the global scope
  const id = Symbol(name);
  (global as any)[id] = initialValue;

  return [
    () => (global as any)[id],
    (value) => {
      (global as any)[id] = value;
    },
  ];
}
