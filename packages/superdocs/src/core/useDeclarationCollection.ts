import { serverContext } from "../internal/serverContext";
import {
  DeclarationCollection,
  DeclarationCollectionOptions,
  makeDeclarationCollection,
} from "./DeclarationCollection";

const [getDeclarationCollection, setDeclarationCollection] = serverContext<
  DeclarationCollection | undefined
>(undefined, "DeclarationCollection");

export function initDeclarationCollection(
  opts: DeclarationCollectionOptions
): DeclarationCollection {
  if (getDeclarationCollection()) {
    throw new Error("`initDeclarationCollection` has already been called");
  }
  const instance = makeDeclarationCollection(opts);
  setDeclarationCollection(instance);
  return instance;
}

export function useDeclarationCollection(): DeclarationCollection {
  const instance = getDeclarationCollection();
  if (!instance) {
    throw new Error(
      "no instance available for DeclarationCollection (call `initDeclarationCollection` somewhere)"
    );
  }
  return instance;
}
