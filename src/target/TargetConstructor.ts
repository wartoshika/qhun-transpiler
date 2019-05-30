import { Target } from "./Target";
import { Project } from "../config/Project";
import * as ts from "typescript";
import { SourceFile } from "../compiler/SourceFile";
import { QhunTranspilerMetadata } from "./QhunTranspilerMetadata";

/**
 * a type that can construct target instances
 */
export interface TargetConstructor<T extends Target = Target> {

    new(project: Project, typeChecker: ts.TypeChecker, sourceFile: SourceFile, metadata: QhunTranspilerMetadata, keyValueStorage: { [key: string]: any }): T;
}
