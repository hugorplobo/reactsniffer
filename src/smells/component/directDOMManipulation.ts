import { AST } from "../../model/types";
import { Node } from "@babel/types";
import { Component } from "../../model/component";
import { domElements } from "../../utils/domElements";
import { SmellType } from "../../model/smell";

export function detectDirectDOMManipulation(
  _ast: AST,
  node: Node,
  component: Component,
) {
  if (
    "object" in node &&
    "name" in node.object &&
    "property" in node &&
    "name" in node.property &&
    ["document", "element"].includes(node.object.name) &&
    domElements.includes(node.property.name)
  ) {
    component.smells.push({
      file: component.file,
      component: component.name,
      lineStart: node.loc?.start.line!,
      lineEnd: node.loc?.end.line!,
      columnStart: node.loc?.start.column!,
      columnEnd: node.loc?.end.column!,
      name: SmellType.DOM,
    });
  }
}
