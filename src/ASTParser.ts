import * as babelParser from "@babel/parser";

export class ASTParser {
  generateAST(sourceCode: string) {
    return babelParser.parse(sourceCode, {
      sourceType: "module",
      plugins: [
        "asyncGenerators",
        "bigInt",
        "classPrivateMethods",
        "classPrivateProperties",
        "classProperties",
        ["decorators", { decoratorsBeforeExport: false }],
        "doExpressions",
        "dynamicImport",
        "exportDefaultFrom",
        "exportNamespaceFrom",
        "typescript",
        "flowComments",
        "functionBind",
        "functionSent",
        "importMeta",
        "jsx",
        "logicalAssignment",
        "nullishCoalescingOperator",
        "numericSeparator",
        "objectRestSpread",
        "optionalCatchBinding",
        "optionalChaining",
        ["pipelineOperator", { proposal: "minimal" }],
        "throwExpressions",
      ],
    });
  }
}
