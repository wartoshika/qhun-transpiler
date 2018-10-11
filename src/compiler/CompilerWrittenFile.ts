import { SourceFile } from "./SourceFile";

export interface CompilerWrittenFile {

    /**
     * the source file
     */
    sourcefile: SourceFile;

    /**
     * the absolute path of the generated file
     */
    generatedFileName: string;
}
