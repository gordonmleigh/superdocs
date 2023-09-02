export type SortFunction<T> = (a: T, b: T) => number;

export function then<T>(...sorts: SortFunction<T>[]): SortFunction<T> {
  return (a, b) => {
    for (const sort of sorts) {
      const result = sort(a, b);
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  };
}
