import { AST } from "../../model/types";
import { Node } from "@babel/types";
import { Component } from "../../model/component";
import { thresholds } from "../../utils/thresholds";
import { SmellType } from "../../model/smell";

export function detectMultipleBooleansForState(
  _ast: AST,
  node: Node,
  component: Component,
) {
  const { BOOLEANS_NUM } = thresholds.components;
  const smellName = SmellType.MB;

  if (component.smells.some((smell) => smell.name === smellName)) {
    return;
  }

  if (
    node.type === "FunctionDeclaration" &&
    component.booleans.length > BOOLEANS_NUM
  ) {
    component.booleans.forEach((bool) => {
      component.smells.push({
        file: component.file,
        component: component.name,
        name: smellName,
        ...bool,
      });
    });
  }
}
