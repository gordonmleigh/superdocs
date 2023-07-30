/**
 * A class of some sort.
 *
 * ```typescript
 * const instance = new Class('Bjarne');
 * ```
 *
 * @group Classes
 */
export class Class implements Interface2 {
  constructor(public readonly name: string) {}

  then<TResult1 = null | undefined, TResult2 = never>(
    onfulfilled?:
      | ((value: null | undefined) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined
  ): PromiseLike<TResult1 | TResult2> {
    throw new Error("Method not implemented.");
  }
}

/**
 * An interface of some sort.
 *
 * @group Interfaces
 */
export interface Interface1<T extends object | null = null>
  extends PromiseLike<T | undefined> {}

/**
 * An interface of some sort.
 *
 * @group Interfaces
 */
export interface Interface2 extends Interface1 {}
