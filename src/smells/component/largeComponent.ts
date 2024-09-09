import { AST } from "../../model/types";
import { Node } from "@babel/types";
import { thresholds } from "../../utils/thresholds";
import { Component } from "../../model/component";
import { SmellType } from "../../model/smell";

export function detectLargeComponent(
  _ast: AST,
  node: Node,
  component: Component,
) {
  const { LOC_COMPONENT, PROPS_NUM, NM } = thresholds.components;
  const smellName = SmellType.LC;

  if (component.smells.some((smell) => smell.name === smellName)) {
    return;
  }

  if (node.type === "ClassDeclaration" || node.type === "FunctionDeclaration") {
    if (
      component.numberOfLines > LOC_COMPONENT ||
      component.props.length > PROPS_NUM ||
      component.classMethods.length > NM
    ) {
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
