import { AST } from "../../model/types";
import { Node } from "@babel/types";
import { Component } from "../../model/component";
import { SmellType } from "../../model/smell";

export function detectForceUpdate(_ast: AST, node: Node, component: Component) {
  if (
    "callee" in node &&
    "property" in node.callee &&
    "name" in node.callee.property &&
    ["forceUpdate", "reload"].includes(node.callee.property.name)
  ) {
    component.smells.push({
      file: component.file,
      component: component.name,
      lineStart: node.loc?.start.line!,
      lineEnd: node.loc?.end.line!,
      columnStart: node.loc?.start.column!,
      columnEnd: node.loc?.end.column!,
      name: SmellType.FU,
    });
  }
}
