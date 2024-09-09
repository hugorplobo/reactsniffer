import { AST } from "../../model/types";
import { JSXAttribute, Node } from "@babel/types";
import { Component } from "../../model/component";
import { SmellType } from "../../model/smell";

type AttrInfo = {
  ref: boolean;
  value: boolean;
};

function setAttrInfo(attr: JSXAttribute, attrInfo: AttrInfo) {
  if (attr.name.name === "ref") {
    attrInfo.ref = true;
  } else if (attr.name.name === "value") {
    attrInfo.value = true;
  }
}

export function detectUncontrolledComponent(
  _ast: AST,
  node: Node,
  component: Component,
) {
  if (
    !(
      "name" in node &&
      typeof node.name === "object" &&
      node.name &&
      "name" in node.name &&
      node.name.name === "input"
    )
  ) {
    return;
  }

  const attrInfo = {
    ref: false,
    value: false,
  };

  if ("attributes" in node) {
    for (const attr of node.attributes) {
      if ("name" in attr && attr.name.type === "JSXIdentifier") {
        setAttrInfo(attr, attrInfo);
      }
    }

    if (attrInfo.ref && !attrInfo.value) {
      component.smells.push({
        file: component.file,
        component: component.name,
        lineStart: node.loc?.start.line!,
        lineEnd: node.loc?.end.line!,
        columnStart: node.loc?.start.column!,
        columnEnd: node.loc?.end.column!,
        name: SmellType.UC,
      });
    }
  }
}
