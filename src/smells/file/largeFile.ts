import { AST } from "../../model/types";
import { thresholds } from "../../utils/thresholds";
import { SmellType } from "../../model/smell";

export function detectLargeFile(ast: AST) {
  const { LOC_FILE, IMPORTS_NUM, COMPONENTS_NUM } = thresholds.files;
  if (
    ast.numberOfLines > LOC_FILE ||
    ast.imports.length > IMPORTS_NUM ||
    ast.components.length > COMPONENTS_NUM
  ) {
    ast.smells.push({ file: ast.filename, name: SmellType.LF });
  }
}
