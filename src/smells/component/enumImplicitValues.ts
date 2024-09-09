import { AST } from "../../model/types";
import { Node } from "@babel/types";
import { Component } from "../../model/component";
import { SmellType } from "../../model/smell";

export function detectEnumImplictValues(
  _ast: AST,
  node: Node,
  component: Component,
) {
  if (node.type === "TSEnumMember" && node.initializer === undefined) {
    component.smells.push({
      file: component.file,
      component: component.name,
      lineStart: node.loc?.start.line!,
      lineEnd: node.loc?.end.line!,
      columnStart: node.loc?.start.column!,
      columnEnd: node.loc?.end.column!,
      name: SmellType.EIV,
    });
  }
}
