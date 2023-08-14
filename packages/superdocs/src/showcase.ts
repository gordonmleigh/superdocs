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
export type ImportedType = import("./core/DeclarationCollection").Declaration;

/**
 * This export is here to test features of the documentation generation.
 * @group Showcase
 */
export type ConditionalType = ImportedType extends Iterable<infer R>
  ? R
  : never;
