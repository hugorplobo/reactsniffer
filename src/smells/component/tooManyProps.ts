import { AST } from "../../model/types";
import { Node } from "@babel/types";
import { Component } from "../../model/component";
import { thresholds } from "../../utils/thresholds";
import { SmellType } from "../../model/smell";

export function detectTooManyProps(
  _ast: AST,
  node: Node,
  component: Component,
) {
  const { PROPS_NUM } = thresholds.components;
  const smellName = SmellType.TP;

  if (component.smells.some((smell) => smell.name === smellName)) {
    return;
  }

  if (node.type === "ClassDeclaration" || node.type === "FunctionDeclaration") {
    if (component.props.length > PROPS_NUM) {
      component.smells.push({
        file: component.file,
        component: component.name,
        lineStart: node.loc?.start.line!,
        lineEnd: node.loc?.end.line!,
        columnStart: node.loc?.start.column!,
        columnEnd: node.loc?.end.column!,
        name: smellName,
      });
    }
  }
}
