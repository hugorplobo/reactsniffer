import * as babelParser from "@babel/parser";
import * as babelTypes from "@babel/types";
import { Node } from "@babel/types";
import { Component } from "./component";

export type AST = babelParser.ParseResult<babelTypes.File> & {
  url: string;
  filename: string;
  numberOfLines: number;
  imports: string[];
  functions: string[];
  reactComponents: string[];
  components: Component[];
  smells: FileSmell[];
};

export type FileSmell = {
  file: string;
  name: string;
};

export type ComponentSmell = FileSmell &
  SmellLocation & {
    component: string;
  };

export type ComponentSmellDetectorStrategy = (
  ast: AST,
  node: Node,
  component: Component,
) => void;

export type FileSmellDetectorStrategy = (ast: AST) => void;

export type FileSmellHeaders = {
  "Large File": string;
  LOC: number;
  N_Components: number;
  N_Functions: number;
  N_Imports: number;
};

export type ComponentSmellHeaders = {
  File: string;
  Component: string;
  LC: string;
  TP: string;
  IIC: string;
  MB: string;
  FU: number;
  DOM: number;
  JSX: number;
  UC: number;
  PIS: number;
  ANY: number;
  NNA: number;
  EIV: number;
  CPP: number;
  MUT: number;
};

export type SmellLocation = {
  lineStart: number;
  lineEnd: number;
  columnStart: number;
  columnEnd: number;
};

export type JsonFileSmell = {
  type: "Component" | "File";
  file: string;
  smell: string;
};

export type JsonComponentSmell = JsonFileSmell &
  SmellLocation & {
    component: string;
  };

export type SmellCSV = {
  File: string;
  Smell: string;
  LOC: number;
};

export type FileSmellCSV = SmellCSV & {
  N_Components: number;
  N_Functions: number;
  N_Imports: number;
};

export type ComponentSmellCSV = SmellCSV & {
  Component: string;
  LineStart: number;
  LineEnd: number;
  Props: number;
  ClassProperties: number;
  ClassMethods: number;
  Functions: number;
};
