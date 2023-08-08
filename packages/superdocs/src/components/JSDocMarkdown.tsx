import rehypeRaw from "rehype-raw";
import { isArray } from "../internal/isArray";
import {
  JSDocNode,
  isJSDocNodeWithComment,
  isJSDocText,
} from "../internal/jsdoc";
import { JSDoc } from "./JSDoc";
import { Markdown } from "./Markdown";
import { NodeProps } from "./NodeProps";

debugger;

/**
 * Render JSDoc as markdown.
 *
 * @remarks
 * This component first converts the {@link JSDocNode}s to a markdown string.
 * The nodes which can't be converted directly to text are converted to a
 * `js-doc` element instead so that they can be replaced again with the
 * original nodes once the markdown is rendered. This two step process allows
 * the rendering of markdown which has other {@link JSDocNode} elements
 * throughout it.
 */
export function JSDocMarkdown({
  collection,
  node,
}: NodeProps<JSDocNode | readonly JSDocNode[]>): JSX.Element {
  const renderer = new JSDocRenderer(node);
  return (
    <div className="declaration-prose">
      <Markdown
        components={
          {
            "jsdoc-node": ({ index }: any) => (
              <JSDoc collection={collection} node={renderer.nodes[index]} />
            ),
          } as any
        }
        rehypePlugins={[rehypeRaw]}
      >
        {renderer.markdown}
      </Markdown>
    </div>
  );
}

class JSDocRenderer {
  public readonly nodes: Exclude<JSDocNode, string>[] = [];
  private text = "";

  public get markdown(): string {
    return this.text;
  }

  constructor(node?: JSDocNode | readonly JSDocNode[]) {
    if (node) {
      this.addComment(node);
    }
  }

  public addComment(node: JSDocNode | readonly JSDocNode[]): void {
    if (isArray(node)) {
      for (const child of node) {
        this.addComment(child);
      }
    } else if (typeof node === "string") {
      this.text += node;
    } else if (isJSDocNodeWithComment(node)) {
      if (node.comment) {
        this.addComment(node.comment);
      }
    } else if (isJSDocText(node)) {
      this.text += node.text;
    } else {
      this.text += `<jsdoc-node index="${this.nodes.length}"></jsdoc-node>`;
      this.nodes.push(node);
    }
  }
}
