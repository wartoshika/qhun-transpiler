import * as ts from "typescript";

export interface CompilerWrittenFile {

    /**
     * the source file
     */
    sourcefile: ts.SourceFile;

    /**
     * the absolute path of the generated file
     */
    generatedFileName: string;
}
