import { AST, JsonComponentSmell, JsonFileSmell } from "../model/types";
import { SmellDetector } from "../smellDetector";
import { View } from "./view";

export class JsonView implements View {
  smells: Array<JsonFileSmell | JsonComponentSmell> = [];

  public add(files: AST[]) {
    files.forEach((file) => {
      const fileProcessed = SmellDetector.detectSmells(file);

      fileProcessed.smells.forEach((smell) => {
        this.smells.push({
          type: "File",
          file: smell.file,
          smell: smell.name,
        });
      });

      fileProcessed.components.forEach((component) => {
        component.smells.forEach((smell) => {
          this.smells.push({
            type: "Component",
            smell: smell.name,
            file: smell.file,
            lineStart: smell.lineStart,
            lineEnd: smell.lineEnd,
            columnStart: smell.columnStart,
            columnEnd: smell.columnEnd,
          });
        });
      });
    });
  }

  public render() {
    console.log(JSON.stringify(this.smells));
  }
}
