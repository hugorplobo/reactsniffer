import { AST } from "./model/types";
import { Node } from "@babel/types";
import { componentSmells, fileSmells } from "./smells";
import { Component } from "./model/component";

export class SmellDetector {
  static detectSmells(ast: AST): AST {
    fileSmells.forEach((smell) => smell(ast));

    ast.program.body.forEach((statement) => {
      const component = new Component(ast, statement);
      this.recursiveSearch(ast, statement, component);
      ast.components.push(component);
    });

    ast.components.forEach((component) => {
      ast.functions = ast.functions.concat(component.functions);
    });

    return ast;
  }

  private static recursiveSearch(
    ast: AST,
    statement: Node,
    component: Component,
  ) {
    componentSmells.forEach((smell) => smell(ast, statement, component));
    this.checkEndRecursion(ast, statement, component);
  }

  private static checkEndRecursion(
    ast: AST,
    statement: object,
    component: Component,
  ) {
    for (const value of Object.values(statement)) {
      if (value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if ("type" in item) {
              this.recursiveSearch(ast, item as unknown as Node, component);
            }
          });
        } else if (typeof value === "object" && "type" in value) {
          this.recursiveSearch(ast, value as unknown as Node, component);
        }
      }
    }
  }
}
