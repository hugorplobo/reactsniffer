import { AST, ComponentSmellHeaders, FileSmellHeaders } from "../model/types";
import { SmellDetector } from "../smellDetector";
import { SmellType } from "../model/smell";
import { View } from "./view";

export class TableView implements View {
  fileSmells: FileSmellHeaders[] = [];
  componentSmells: ComponentSmellHeaders[] = [];

  public add(files: AST[]) {
    files.forEach((file) => {
      const fileProcessed = SmellDetector.detectSmells(file);

      fileProcessed.smells.forEach((smell) => {
        this.fileSmells.push({
          "Large File": file.filename,
          LOC: file.numberOfLines,
          N_Components: file.reactComponents.length,
          N_Functions: file.functions.length,
          N_Imports: file.imports.length,
        });
      });

      fileProcessed.components.forEach((component) => {
        if (component.smells.length > 0) {
          this.componentSmells.push({
            File: component.file,
            Component: component.name,
            LC: component.smells.some((c) => c.name === SmellType.LC)
              ? "Y"
              : "N",
            TP: component.smells.some((c) => c.name === SmellType.TP)
              ? "Y"
              : "N",
            IIC: component.smells.some((c) => c.name === SmellType.IIC)
              ? "Y"
              : "N",
            MB: component.smells.some((c) => c.name === SmellType.MB)
              ? "Y"
              : "N",
            FU: component.smells.filter((c) => c.name === SmellType.FU).length,
            DOM: component.smells.filter((c) => c.name === SmellType.DOM)
              .length,
            JSX: component.smells.filter((c) => c.name === SmellType.JSX)
              .length,
            UC: component.smells.filter((c) => c.name === SmellType.UC).length,
            PIS: component.smells.filter((c) => c.name === SmellType.PIS)
              .length,
            ANY: component.smells.filter((c) => c.name === SmellType.ANY)
              .length,
            NNA: component.smells.filter((c) => c.name === SmellType.NNA)
              .length,
            EIV: component.smells.filter((c) => c.name === SmellType.EIV)
              .length,
            CPP: component.smells.filter((c) => c.name === SmellType.CPP)
              .length,
            MUT: component.smells.filter((c) => c.name === SmellType.MUT)
              .length,
          });
        }
      });
    });
  }

  public render() {
    if (this.fileSmells.length > 0) {
      console.table(this.fileSmells);
    }

    if (this.componentSmells.length > 0) {
      console.table(this.componentSmells);
    }
  }
}
