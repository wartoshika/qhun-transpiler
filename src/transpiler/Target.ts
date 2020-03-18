import { SourceFile } from "typescript";
import { TranspileResult } from "./TranspileResult";

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

    /**
     * replaces project wide magic constants
     * @param code the code to use when replaceing
     */
    replaceMagicConstants(code: string): string;

    /**
     * ability to execute code before the given source file will be transpiled.
     * @param sourceFile the file that will be transpiled
     * @returns original or modified file
     */
    beforeFileTranspile?(sourceFile: SourceFile): SourceFile;

    /**
     * ability to execute code after the given source file has been transpiled.
     * @param sourceFile the file that has been transpiled
     * @param code the transpiled code of the file
     * @returs original or modified code
     */
    afterFileTranspile?(sourceFile: SourceFile, code: string): string;

    /**
     * ability to execute code before any transpiling will run
     */
    beforeBatch?(): void;

    /**
     * ability to execute code after all files are transpiled
     * @param result the transpiling result
     * @returns original or modified transpile result set
     */
    afterBatch?(result: TranspileResult): TranspileResult;
}