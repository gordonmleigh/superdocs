/**
 * This export is here to test features of the documentation generation.
 *
 * @remarks
 * Although skipped in the rendering, this type is actually using the following
 * definition:
 *
 * ```typescript
 * type ImportedType = import("./core/DeclarationCollection").Declaration;
 * ```
 *
 * @group Showcase
 */
export type _ImportedType = import("./core/DeclarationCollection").Declaration;

/**
 * This export is here to test features of the documentation generation.
 * @group Showcase
 */
export type _ConditionalType = _ImportedType extends Iterable<infer R>
  ? R
  : never;

/**
 * This export is here to test features of the documentation generation.
 * @group Showcase
 */
export type _MappedType<Type> = {
  -readonly [Property in keyof Type as string]-?: () => Type[Property];
};

/**
 * This export is here to test features of the documentation generation.
 * @group Showcase
 */
export type _TemplateLiteral<Type extends string> = `template${Type}`;

/**
 * This export is here to test features of the documentation generation.
 * @group Showcase
 */
export const _ConstVariableNumber = 1;

/**
 * This export is here to test features of the documentation generation.
 * @group Showcase
 */
export const _ConstVariableString = "String";

/**
 * This export is here to test features of the documentation generation.
 * @group Showcase
 */
export let _LetVariable = 1;
_LetVariable = 2;

/**
 * This export is here to test features of the documentation generation.
 * @group Showcase
 */
// eslint-disable-next-line no-var
export var _VarVariable = 1;

/**
 * This export is here to test features of the documentation generation.
 * @group Showcase
 */
export enum _SimpleEnum {
  One,
  Two,
  Zwei = Two,
  Four = 4,
}

/**
 * This export is here to test features of the documentation generation.
 * @group Showcase
 */
export enum _StringEnum {
  One = "one",
  Two = "two",
  Three = "three",
}

/**
 * This export is here to test features of the documentation generation.
 * @group Showcase
 */
export enum _DerivedEnum {
  One = _StringEnum.One,
}

/**
 * This export is here to test features of the documentation generation.
 * @group Showcase
 */
export const _ConstVariableEnum = _SimpleEnum.One;

/**
 * This export is here to test features of the documentation generation.
 * @group Showcase
 */
export interface _ComputedProps {
  [Symbol.iterator]: string;
  [_StringEnum.One]: number;
}

/**
 * This export is here to test features of the documentation generation.
 * @group Showcase
 */
export interface _InterfaceAccessors {
  get hello(): string;
  set hello(value: string);
}
