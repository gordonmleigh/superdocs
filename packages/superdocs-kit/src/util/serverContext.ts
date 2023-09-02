export interface ServerContext<T> {
  current: T;
}

export function serverContext<T>(
  name: string,
  init: () => T,
): ServerContext<T> {
  const symbol = Symbol.for(`serverContext:${name}`);

  if (!(symbol in global)) {
    (global as any)[symbol] = init();
  }

  return {
    get current(): T {
      return (global as any)[symbol];
    },
    set current(value: T) {
      (global as any)[symbol] = value;
    },
  };
}
