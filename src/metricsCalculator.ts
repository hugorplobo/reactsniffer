import {Node, ObjectPattern} from "@babel/types";
import { Component } from "./model/component";

export class MetricsCalculator {
  static calculateMetrics(node: Node, component: Component) {
    this.calculateClassProperties(node, component);
    this.calculateProps(node, component);
    this.calculateFunctions(node, component);
    this.calculateBooleans(node, component);
  }

  private static calculateClassProperties(node: Node, component: Component) {
    if (node.type === "ClassProperty" && "name" in node.key) {
      if (node.value?.type === "ArrowFunctionExpression") {
        component.classMethods.push(node.key.name);
      } else {
        component.classProperties.push(node.key.name);
      }
    }
  }

  private static calculateProps(node: Node, component: Component) {
    if (
      node.type === "MemberExpression" &&
      node.object.type === "MemberExpression" &&
      node.object.object.type === "ThisExpression" &&
      node.object.property.type === "Identifier" &&
      node.object.property.name === "props" &&
      node.property.type === "Identifier"
    ) {
      if (!component.props.includes(node.property.name)) {
        component.props.push(node.property.name);
      }
    }

    if (node.type === "FunctionDeclaration") {
      const props = node.params[0];

      if (props && props.type === "ObjectPattern") {
        this.captureProps(props, component);
      }
    }
  }

  private static captureProps(props: ObjectPattern, component: Component) {
    for (const prop of props.properties) {
      if (
        prop.type === "ObjectProperty" &&
        prop.key.type === "Identifier" &&
        !component.props.includes(prop.key.name)
      ) {
        component.props.push(prop.key.name);
      }
    }
  }

  private static calculateFunctions(node: Node, component: Component) {
    if (node.type === "FunctionDeclaration" && node.id?.name) {
      component.functions.push(node.id.name);
    } else if (
      node.type === "VariableDeclaration" &&
      node.declarations[0].init &&
      node.declarations[0].init.type === "ArrowFunctionExpression" &&
      "name" in node.declarations[0].id
    ) {
      component.functions.push(node.declarations[0].id.name);
    }

    if (
      node.type === "ClassMethod" &&
      node.kind !== "constructor" &&
      "name" in node.key
    ) {
      component.classMethods.push(node.key.name);
    }
  }

  private static calculateBooleans(node: Node, component: Component) {
    if (
      node.type === "VariableDeclarator" &&
      "init" in node &&
      node.init &&
      "callee" in node.init &&
      "arguments" in node.init &&
      "name" in node.init.callee &&
      node.init.callee.name === "useState" &&
      node.init.arguments.length > 0
    ) {
      if (node.init.arguments[0].type === "BooleanLiteral") {
        component.booleans.push({
          lineStart: node.loc!.start.line,
          lineEnd: node.loc!.end.line,
          columnStart: node.loc!.start.column,
          columnEnd: node.loc!.end.column,
        });
      }
    }
  }
}
