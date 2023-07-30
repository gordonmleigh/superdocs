import { dirname, relative, resolve } from "path";
import { SourceMapConsumer } from "source-map";

import {
  SourceMapConverter,
  fromComment,
  fromMapFileComment,
} from "convert-source-map";
import { readFileSync } from "fs";
import ts from "typescript";
import { NodeLocation } from "../core/NodeLocation";
import { assert } from "./assert";

export type GetNodeLocation = (node: ts.Node) => NodeLocation;

export function makeGetNodeLocation(
  source: ts.SourceFile,
  sourceRoot: string,
): GetNodeLocation {
  const sourcePath = relative(resolve(sourceRoot), source.fileName);
  const sourceDir = dirname(source.fileName);

  const getNodeLocation: GetNodeLocation = (node) => {
    assert(
      node.getSourceFile() === source,
      "the given node belongs to another source file",
    );
    const pos = source.getLineAndCharacterOfPosition(node.pos);

    return {
      char: pos.character + 1,
      line: pos.line + 1,
      path: sourcePath,
    };
  };

  const [comment, url] = getSourceMapUrl(source.text);
  if (!comment || !url) {
    return getNodeLocation;
  }

  let converter: SourceMapConverter;
  let mappedSourceRoot: string;

  if (url.startsWith("data:")) {
    converter = fromComment(comment);
    mappedSourceRoot = sourceDir;
  } else {
    converter = fromMapFileComment(comment, (path) =>
      readFileSync(resolve(sourceDir, path), "utf-8"),
    );
    mappedSourceRoot = dirname(resolve(sourceDir, url));
  }

  const sourceMap = converter.toObject();
  const consumer = new SourceMapConsumer(sourceMap);

  return (node): NodeLocation => {
    const generatedPos = getNodeLocation(node);

    const originalPos = consumer.originalPositionFor({
      column: generatedPos.char - 1,
      line: generatedPos.line,
    });

    return {
      char:
        originalPos.column !== null
          ? originalPos.column + 1
          : generatedPos.char,
      line: originalPos.line ?? generatedPos.line,
      path: originalPos.source
        ? relative(sourceRoot, resolve(mappedSourceRoot, originalPos.source))
        : generatedPos.path,
    };
  };
}

function getSourceMapUrl(
  source: string,
): [comment: string | undefined, url: string | undefined] {
  // blagged from https://github.com/evanw/node-source-map-support/blob/7b5b81eb14c9ee6c6537398262bf7dab8580621c/source-map-support.js#L148C1-L177C3
  const regexp =
    /(?:\/\/[@#][\s]*sourceMappingURL=([^\s'"]+)[\s]*$)|(?:\/\*[@#][\s]*sourceMappingURL=([^\s*'"]+)[\s]*(?:\*\/)[\s]*$)/gm;
  // Keep executing the search to find the *last* sourceMappingURL to avoid
  // picking up sourceMappingURLs from comments, strings, etc.
  for (let lastMatch: RegExpExecArray | undefined; ; ) {
    const match = regexp.exec(source);
    if (!match) {
      // the url will be in group 2 if using /* */ comments
      return [lastMatch?.[0], lastMatch?.[1] || lastMatch?.[2]];
    }
    lastMatch = match;
  }
}
