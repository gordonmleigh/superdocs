import ts from "typescript";
import { assert } from "./assert";
import { getSyntaxKindName } from "./getSyntaxKindName";
import { hash } from "./hash";
import { slugify } from "./slugify";

export type NamedNode =
  | ts.ClassDeclaration
  | ts.ClassElement
  | ts.EnumDeclaration
  | ts.EnumMember
  | ts.FunctionDeclaration
  | ts.InterfaceDeclaration
  | ts.ParameterDeclaration
  | ts.PropertyDeclaration
  | ts.TypeAliasDeclaration
  | ts.TypeElement
  | ts.TypeParameterDeclaration
  | ts.VariableDeclaration;

// type check to make sure all of the NamedNodes have names
void ((node: NamedNode) => node.name);

export function isNamedNode(node: ts.Node): node is NamedNode {
  return (
    ts.isClassDeclaration(node) ||
    ts.isClassElement(node) ||
    ts.isEnumDeclaration(node) ||
    ts.isEnumMember(node) ||
    ts.isFunctionDeclaration(node) ||
    ts.isFunctionLike(node) ||
    ts.isInterfaceDeclaration(node) ||
    ts.isParameter(node) ||
    ts.isPropertyDeclaration(node) ||
    ts.isTypeAliasDeclaration(node) ||
    ts.isTypeElement(node) ||
    ts.isTypeParameterDeclaration(node) ||
    ts.isVariableDeclaration(node)
  );
}

export function getName(node: ts.Node): string | undefined {
  if (isNamedNode(node) && node.name) {
    if (ts.isIdentifier(node.name)) {
      return node.name.text;
    }
    if (ts.isStringLiteral(node.name)) {
      return `"${node.name.text}"`;
    }
    if (ts.isNumericLiteral(node.name)) {
      return `${node.name.text}`;
    }
    if (ts.isComputedPropertyName(node.name)) {
      return `${node.name.getText()}`;
    }
  }
  if (ts.isParameter(node)) {
    return `arg${getParameterIndex(node)}`;
  }
  if (
    ts.isConstructSignatureDeclaration(node) ||
    ts.isConstructorDeclaration(node)
  ) {
    return "constructor";
  }
  if (ts.isIndexSignatureDeclaration(node)) {
    return `Index [${node.parameters.map((x) => x.getText()).join(", ")}]`;
  }
}

export function isExported(node: ts.Statement): boolean {
  return (
    ts.canHaveModifiers(node) &&
    !!node.modifiers?.find((x) => x.kind === ts.SyntaxKind.ExportKeyword)
  );
}

export function isPrivateMember(
  node: ts.TypeElement | ts.ClassElement,
): boolean {
  if (ts.canHaveModifiers(node) && node.modifiers) {
    if (node.modifiers.some((x) => x.kind === ts.SyntaxKind.PrivateKeyword)) {
      return true;
    }
  }
  if ("name" in node && node.name) {
    if (ts.isPrivateIdentifier(node.name)) {
      return true;
    }
  }
  return false;
}

export function getParameterIndex(node: ts.ParameterDeclaration): number {
  assert(ts.isFunctionLike(node.parent));
  const index = node.parent.parameters.indexOf(node);
  assert(index >= 0);
  return index;
}

export function getNodeId(node: ts.Node): string {
  const id = hash([node.getSourceFile().fileName, `${node.pos}`])?.slice(0, 5);
  return `node-${id}`;
}

export function slugifyNode(node: ts.Node, parent?: ts.Node): string {
  if (parent) {
    return slugifyNode(parent) + "-" + slugifyNode(node);
  }
  const name = getName(node) ?? getNodeId(node);
  return getSyntaxKindName(node.kind) + "-" + slugify(name);
}
