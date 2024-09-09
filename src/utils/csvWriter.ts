import { createObjectCsvWriter } from "csv-writer";
import { Component } from "../model/component";
import { AST, ComponentSmellCSV, FileSmellCSV } from "../model/types";

export class CSVWriter {
  static async writeComponents(components: Component[]) {
    const rows: ComponentSmellCSV[] = [];

    components.forEach((component) => {
      component.smells.forEach((smell) => {
        rows.push({
          LOC: component.numberOfLines,
          Component: component.name,
          File: component.fileUrl,
          Smell: smell.name,
          LineStart: smell.lineStart,
          LineEnd: smell.lineEnd,
          ClassProperties: component.classProperties.length,
          ClassMethods: component.classMethods.length,
          Props: component.props.length,
          Functions: component.functions.length,
        });
      });
    });

    if (rows.length < 1) {
      return;
    }

    await this.writeCSV("components_smells.csv", rows);

    console.log(
      "A CSV file with details about the smells per components was generated: components_smells.csv",
    );
  }

  static async writeFiles(asts: AST[]) {
    const rows: FileSmellCSV[] = [];

    asts.forEach((ast) => {
      ast.smells.forEach((smell) => {
        rows.push({
          File: ast.url,
          Smell: smell.name,
          LOC: ast.numberOfLines,
          N_Components: ast.components.length,
          N_Functions: ast.functions.length,
          N_Imports: ast.imports.length,
        });
      });
    });

    if (rows.length < 1) {
      return;
    }

    await this.writeCSV("files_smells.csv", rows);

    console.log(
      "A CSV file with details about the smells per files was generated: files_smells.csv",
    );
  }

  private static async writeCSV(filename: string, records: object[]) {
    const csvWriter = createObjectCsvWriter({
      path: filename,
      header: Object.keys(records[0]).map((key) => ({ id: key, title: key })),
    });

    await csvWriter.writeRecords(records);
  }
}
