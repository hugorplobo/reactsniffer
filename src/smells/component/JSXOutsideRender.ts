import { AST } from "../../model/types";
import { Node } from "@babel/types";
import { Component } from "../../model/component";
import { SmellType } from "../../model/smell";

export function detectJSXOutsideRender(
  _ast: AST,
  node: Node,
  component: Component,
) {
  if (
    node.type === "ClassMethod" &&
    "name" in node.key &&
    node.key.name !== "render"
  ) {
    for (const statement of node.body.body) {
      if (
        statement.type === "ReturnStatement" &&
        statement.argument &&
        statement.argument.type === "JSXElement"
      ) {
        component.smells.push({
          file: component.file,
          component: component.name,
          lineStart: statement.loc?.start.line!,
          lineEnd: statement.loc?.end.line!,
          columnStart: statement.loc?.start.column!,
          columnEnd: statement.loc?.end.column!,
          name: SmellType.JSX,
        });

        return;
      }
    }
  }
}
