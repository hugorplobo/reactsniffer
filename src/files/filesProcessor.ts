import { FileReader } from "./fileReader";
import { ASTParser } from "../ASTParser";
import { AST } from "../model/types";
import { Statement } from "@babel/types";

export class FilesProcessor {
  private fileReader: FileReader;
  private astParser: ASTParser;
  readonly files: AST[];

  constructor(dir: string) {
    this.fileReader = new FileReader(dir);
    this.astParser = new ASTParser();
    this.files = [];

    this.processFiles();
  }

  private processFiles() {
    this.fileReader.files.forEach((file) => {
      const sourceCode = this.fileReader.getAllLines(file);
      const ast: AST = {
        url: file,
        filename: file.substring(file.lastIndexOf("/") + 1),
        numberOfLines: 0,
        imports: [],
        reactComponents: [],
        components: [],
        smells: [],
        functions: [],
        ...this.astParser.generateAST(sourceCode),
      };

      ast.numberOfLines =
        (ast.loc?.end.line ?? 0) - (ast.loc?.start.line ?? 0) + 1;

      ast.program.body.forEach((statement) => {
        this.calculateImports(ast, statement);
        this.calculateComponents(ast, statement);
      });

      this.files.push(ast);
    });
  }

  private calculateImports(ast: AST, statement: Statement) {
    if ("specifiers" in statement) {
      if (statement.specifiers == null) {
        return;
      }

      statement.specifiers.forEach((specifier) => {
        if (
          specifier.type == "ImportSpecifier" ||
          specifier.type == "ImportDefaultSpecifier"
        ) {
          ast.imports.push(specifier.local.name);
        }
      });
    }
  }

  private calculateComponents(ast: AST, statement: Statement) {
    if (
      statement.type === "ClassDeclaration" ||
      statement.type === "FunctionDeclaration"
    ) {
      if (
        statement.id?.name.startsWith(statement.id.name[0].toUpperCase())
      ) {
        ast.reactComponents.push(statement.id.name);
        return;
      }
    }

    if (
      statement.type === "VariableDeclaration" &&
      statement.declarations[0].init?.type === "ArrowFunctionExpression" &&
      "name" in statement.declarations[0].id &&
        statement.declarations[0].id.name.startsWith(
            statement.declarations[0].id.name[0].toUpperCase()
        )
    ) {
      ast.reactComponents.push(statement.declarations[0].id.name);
    }

    if (statement.type === "ExportNamedDeclaration" && statement.declaration) {
      this.calculateComponents(ast, statement.declaration);
    }
  }
}
