import { detectAnyType } from "./component/anyType";
import {
  ComponentSmellDetectorStrategy,
  FileSmellDetectorStrategy,
} from "../model/types";
import { detectLargeFile } from "./file/largeFile";
import { detectForceUpdate } from "./component/forceUpdate";
import { detectDirectDOMManipulation } from "./component/directDOMManipulation";
import { detectPropsInInitialState } from "./component/propsInInitialState";
import { detectUncontrolledComponent } from "./component/uncontrolledComponent";
import { detectJSXOutsideRender } from "./component/JSXOutsideRender";
import { detectLargeComponent } from "./component/largeComponent";
import { detectInheritanceInsteadOfComposition } from "./component/inheritanceInsteadOfComposition";
import { detectTooManyProps } from "./component/tooManyProps";
import { detectManyNonNullAssertions } from "./component/manyNonNullAssertions";
import { detectMissingUnionTypeAssertions } from "./component/missingUnionTypeAbstraction";
import { detectEnumImplictValues } from "./component/enumImplicitValues";
import { detectMultipleBooleansForState } from "./component/multipleBooleansForState";
import { detectChildrenPropsPitfall } from "./component/childrenPropsPitfall";

export const componentSmells: ComponentSmellDetectorStrategy[] = [
  detectAnyType,
  detectForceUpdate,
  detectDirectDOMManipulation,
  detectPropsInInitialState,
  detectUncontrolledComponent,
  detectJSXOutsideRender,
  detectLargeComponent,
  detectInheritanceInsteadOfComposition,
  detectTooManyProps,
  detectManyNonNullAssertions,
  detectMissingUnionTypeAssertions,
  detectEnumImplictValues,
  detectMultipleBooleansForState,
  detectChildrenPropsPitfall,
];

export const fileSmells: FileSmellDetectorStrategy[] = [detectLargeFile];
