/**
 * A class of some sort.
 *
 * ```typescript
 * const instance = new Class('Bjarne');
 * ```
 *
 * @group Classes
 */
export class Class {
  constructor(public readonly name: string) {}
}

/**
 * An interface of some sort.
 *
 * @group Interfaces
 */
export interface Interface1<T extends object = any>
  extends PromiseLike<T | undefined> {}

/**
 * An interface of some sort.
 *
 * @group Interfaces
 */
export interface Interface2 extends Interface1 {}
