import {
  SourceMapConverter,
  fromComment,
  fromMapFileComment,
} from "convert-source-map";
import { readFileSync } from "fs";
import { dirname, relative, resolve } from "path";
import { SourceMapConsumer } from "source-map";
import ts from "typescript";
import { NodeLocation } from "../core/NodeLocation";

export interface NodeLocationMapOptions {
  sourceRoot: string;
}

export class NodeLocationMap {
  private readonly sourceMaps = new Map<ts.SourceFile, NodeLocationFactory>();
  private readonly sourceRoot: string;

  constructor(opts: NodeLocationMapOptions) {
    this.sourceRoot = opts.sourceRoot;
  }

  public getNodeLocation(node: ts.Node): NodeLocation {
    return this.getLocationFactory(node.getSourceFile()).getNodeLocation(node);
  }

  public getLocationFactory(source: ts.SourceFile): NodeLocationFactory {
    let factory = this.sourceMaps.get(source);
    if (!factory) {
      factory = makeNodeLocationFactory(this.sourceRoot, source);
      this.sourceMaps.set(source, factory);
    }
    return factory;
  }
}

class NodeLocationFactory {
  constructor(public readonly sourceRoot: string) {}

  public getNodeLocation(node: ts.Node): NodeLocation {
    const source = node.getSourceFile();
    const sourcePath = relative(resolve(this.sourceRoot), source.fileName);
    const pos = source.getLineAndCharacterOfPosition(node.getStart());

    return {
      char: pos.character + 1,
      line: pos.line + 1,
      path: sourcePath,
    };
  }
}

class NodeLocationFactoryWithSourceMap extends NodeLocationFactory {
  constructor(
    sourceRoot: string,
    private readonly mappedSourceRoot: string,
    private readonly consumer: SourceMapConsumer,
  ) {
    super(sourceRoot);
  }

  public override getNodeLocation(node: ts.Node): NodeLocation {
    const generatedPos = super.getNodeLocation(node);
    const originalPos = this.consumer.originalPositionFor({
      bias: SourceMapConsumer.LEAST_UPPER_BOUND,
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
        ? relative(
            this.sourceRoot,
            resolve(this.mappedSourceRoot, originalPos.source),
          )
        : generatedPos.path,
    };
  }
}

function makeNodeLocationFactory(
  sourceRoot: string,
  source: ts.SourceFile,
): NodeLocationFactory {
  // blagged from https://github.com/evanw/node-source-map-support/blob/7b5b81eb14c9ee6c6537398262bf7dab8580621c/source-map-support.js#L148C1-L177C3
  const regexp =
    /(?:\/\/[@#][\s]*sourceMappingURL=([^\s'"]+)[\s]*$)|(?:\/\*[@#][\s]*sourceMappingURL=([^\s*'"]+)[\s]*(?:\*\/)[\s]*$)/gm;
  // Keep executing the search to find the *last* sourceMappingURL to avoid
  // picking up sourceMappingURLs from comments, strings, etc.
  for (let lastMatch: RegExpExecArray | undefined; ; ) {
    const match = regexp.exec(source.text);
    if (!match) {
      if (!lastMatch) {
        return new NodeLocationFactory(sourceRoot);
      }

      // the url will be in group 2 if using /* */ comments
      const comment = lastMatch[0];
      const url = lastMatch[1] || lastMatch[2];
      const sourceDir = dirname(source.fileName);

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

      return new NodeLocationFactoryWithSourceMap(
        sourceRoot,
        mappedSourceRoot,
        consumer,
      );
    }
    lastMatch = match;
  }
}
