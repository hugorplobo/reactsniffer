import { AST } from "../../model/types";
import { Node } from "@babel/types";
import { Component } from "../../model/component";
import { SmellType } from "../../model/smell";

export function detectMissingUnionTypeAssertions(
  _ast: AST,
  node: Node,
  component: Component,
) {
  if (
    node.type === "TSTypeAnnotation" &&
    node.typeAnnotation.type === "TSUnionType"
  ) {
    component.smells.push({
      file: component.file,
      component: component.name,
      lineStart: node.loc?.start.line!,
      lineEnd: node.loc?.end.line!,
      columnStart: node.typeAnnotation.loc?.start.column!,
      columnEnd: node.typeAnnotation.loc?.end.column!,
      name: SmellType.MUT,
    });
  }
}
