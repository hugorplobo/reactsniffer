import { Node } from "@babel/types";
import { AST } from "../../model/types";
import { Component } from "../../model/component";
import { SmellType } from "../../model/smell";

export function detectAnyType(_ast: AST, node: Node, component: Component) {
  if (node.type === "TSAnyKeyword") {
    component.smells.push({
      file: component.file,
      component: component.name,
      lineStart: node.loc?.start.line!,
      lineEnd: node.loc?.end.line!,
      columnStart: node.loc?.start.column!,
      columnEnd: node.loc?.end.column!,
      name: SmellType.ANY,
    });
  }
}
