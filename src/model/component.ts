import { AST, ComponentSmell, SmellLocation } from "./types";
import { Node } from "@babel/types";
import { MetricsCalculator } from "../metricsCalculator";

export class Component {
  file: string;
  fileUrl: string;
  name: string = "";
  numberOfLines: number;
  booleans: SmellLocation[] = [];
  props: string[] = [];
  classProperties: string[] = [];
  classMethods: string[] = [];
  functions: string[] = [];
  smells: ComponentSmell[] = [];

  constructor(ast: AST, statement: Node) {
    this.file = ast.filename;
    this.fileUrl = ast.url;
    this.numberOfLines = statement.loc?.end.line! - statement.loc?.start.line!;

    this.recursiveCalculate(statement);
  }

  private recursiveCalculate(statement: Node) {
    MetricsCalculator.calculateMetrics(statement, this);
    this.findName(statement);

    for (const value of Object.values(statement)) {
      if (value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if ("type" in item) {
              this.recursiveCalculate(item as unknown as Node);
            }
          });
        } else if (typeof value === "object" && "type" in value) {
          this.recursiveCalculate(value as unknown as Node);
        }
      }
    }
  }

  private findName(statement: Node) {
    if (this.name !== "") {
      return;
    }

    if ("id" in statement && statement.id) {
      if (statement.id.type === "Identifier") {
        this.name = statement.id.name;
      } else if (statement.id.type === "StringLiteral") {
        this.name = statement.id.value;
      }
    }
  }
}
