import * as ts from "typescript";

export class CompileResult {

    constructor(
        public file: ts.SourceFile,
        public generatedSourcecode: string,
        public writer: (code: string) => void
    ) { }
}
