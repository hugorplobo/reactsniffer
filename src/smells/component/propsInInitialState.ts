import { AST } from "../../model/types";
import { Identifier, Node } from "@babel/types";
import { Component } from "../../model/component";
import { SmellType } from "../../model/smell";

export function detectPropsInInitialState(
  _ast: AST,
  node: Node,
  component: Component,
) {
  if (node.type !== "ClassMethod" || node.kind !== "constructor") {
    return;
  }

  const params = node.params
    .filter((param) => param.type === "Identifier")
    .map((param) => (param as Identifier).name);

  for (const statement of node.body.body) {
    if (
      !(
        "expression" in statement &&
        "left" in statement.expression &&
        "right" in statement.expression &&
        "property" in statement.expression.left &&
        "name" in statement.expression.left.property &&
        "properties" in statement.expression.right &&
        statement.expression.left.property.name == "state"
      )
    ) {
      continue;
    }

    for (const prop of statement.expression.right.properties) {
      if (
        "value" in prop &&
        "object" in prop.value &&
        "name" in prop.value.object &&
        params.includes(prop.value.object.name)
      ) {
        component.smells.push({
          file: component.file,
          component: component.name,
          lineStart: statement.loc?.start.line!,
          lineEnd: statement.loc?.end.line!,
          columnStart: statement.loc?.start.column!,
          columnEnd: statement.loc?.end.column!,
          name: SmellType.PIS,
        });

        return;
      }
    }
  }
}
