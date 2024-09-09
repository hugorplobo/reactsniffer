import { AST } from "../model/types";

export interface View {
  add: (files: AST[]) => void;
  render: () => void;
}
