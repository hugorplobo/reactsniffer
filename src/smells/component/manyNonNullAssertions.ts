import { AST } from "../../model/types";
import { Node } from "@babel/types";
import { Component } from "../../model/component";
import { SmellType } from "../../model/smell";

export function detectManyNonNullAssertions(
  _ast: AST,
  node: Node,
  component: Component,
) {
  if (node.type === "TSNonNullExpression") {
    component.smells.push({
      file: component.file,
      component: component.name,
      lineStart: node.loc?.start.line!,
      lineEnd: node.loc?.end.line!,
      columnStart: node.loc?.start.column!,
      columnEnd: node.loc?.end.column!,
      name: SmellType.NNA,
    });
  }
}
