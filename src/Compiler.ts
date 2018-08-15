import { Project } from "./config/Project";
import * as ts from "typescript";
import { TargetFactory } from "./target/TargetFactory";
import { Transpiler } from "./transpiler/Transpiler";

import * as path from "path";
import * as fs from "fs";
import * as shelljs from "shelljs";
import { Target } from "./target/Target";
import { UnsupportedError } from "./error/UnsupportedError";

declare type TranspilerError = {
    error: Error,
    file: ts.SourceFile
};

export class Compiler {

    /**
     * @param project the project configuration
     */
    constructor(
        private project: Project
    ) { }

    /**
     * compiles the given files and transpiles them into the target language
     * @param files the files to compile and transpile
     * @returns true if the compiling and transpiling was successfull
     */
    public compile(files: string[]): boolean {

        // create a typescript program
        const program = ts.createProgram(files, this.project.parsedCommandLine.options);
        const typeChecker = program.getTypeChecker();

        // create the transpiling target
        const targetFactory = new TargetFactory();
        let lastSourceFile: ts.SourceFile;

        // iterate over every source file
        try {
            program.getSourceFiles().filter(file => !file.isDeclarationFile).forEach(sourceFile => {

                // create the transpiler
                const target = targetFactory.create(this.project.target, this.project, typeChecker);
                const extension = target.getFileExtension();
                const transpiler = new Transpiler(target);

                // declare last soruce file
                lastSourceFile = sourceFile;

                // transpile this file
                const transpiledCode = transpiler.transpile(sourceFile);

                // output the transpiled code into the destination file
                this.writeDestinationFile(sourceFile, transpiledCode, extension);
            });

            // everything was successfull!
            return true;
        } catch (e) {

            // check for unsupported error
            if (e instanceof UnsupportedError) {

                // get position of error
                if (e.node) {
                    const position = ts.getLineAndCharacterOfPosition(lastSourceFile, e.node.pos);

                    // print the error
                    console.error(e.message);
                    console.error(`${lastSourceFile.fileName}: Line: ${position.line + 1}, Column: ${position.character}\n${e.stack}`);
                } else {

                    console.error(e.message, e.stack);
                }
            } else {

                // just log the error
                console.error(e.message, e.stack);
            }

            return false;
        }
    }

    /**
     * writes the destination file
     * @param sourceFile the original source file
     * @param transpiled the transpiled source code
     * @param extension the target file extension
     */
    private writeDestinationFile(sourceFile: ts.SourceFile, transpiled: string, extension: string): void {

        const filePath = path.resolve(sourceFile.fileName);

        // remove the cwd from the file path
        const partOfFilePath = filePath.replace(this.project.rootDir, "");
        const destinationDir = path.dirname(path.join(this.project.rootDir, path.basename(this.project.outDir), partOfFilePath)).replace(this.project.stripOutDir, "");

        // creat that dir
        shelljs.mkdir("-p", destinationDir);

        // write the file
        const destinationFileName = path.join(destinationDir, path.basename(filePath, ".ts") + `.${extension}`);

        console.log("Write: ", destinationFileName);

        fs.writeFileSync(destinationFileName, transpiled);
    }
}
