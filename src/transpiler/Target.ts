import { SourceFile } from "typescript";

export interface Target {

    /**
     * get the target file extension
     */
    getFileExtension(): string;

    /**
     * transpiles the given source file
     * @param file the file to transpile
     */
    transpileSourceFile(file: SourceFile): string;

    /**
     * indicates that this language is case sensitive when using variable names
     */
    isCaseSensitive(): boolean;
}