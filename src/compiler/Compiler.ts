import { Project } from "../config/Project";
import * as ts from "typescript";
import { TargetFactory } from "../target/TargetFactory";
import { Transpiler } from "../transpiler/Transpiler";
import { CompilerWrittenFile } from "./CompilerWrittenFile";
import { Target } from "../target/Target";
import { TranspilerFunctions } from "../transpiler/TranspilerFunctions";
import { ErrorWithNode } from "../error/ErrorWithNode";

import * as path from "path";
import * as fs from "fs";
import * as shelljs from "shelljs";

export class Compiler {

    /**
     * a stack of all written files
     */
    private writtenFileStack: CompilerWrittenFile[] = [];

    /**
     * @param project the project configuration
     */
    constructor(
        private project: Project
    ) { }

    /**
     * compiles the given files and transpiles them into the target language
     * @param files the files to compile and transpile
     * @returns the amount of successfully transpiled and written files. false on error
     */
    public compile(files: string[]): number | boolean {

        // create a typescript program
        const program = ts.createProgram(files, this.project.parsedCommandLine.options);
        const typeChecker = program.getTypeChecker();

        // create the transpiling target
        const targetFactory = new TargetFactory();
        let lastSourceFile: ts.SourceFile;
        let lastTarget: Target;

        // iterate over every source file
        try {
            program.getSourceFiles().filter(file => !file.isDeclarationFile).forEach(sourceFile => {

                // create the transpiler
                const target = targetFactory.create(this.project.target, this.project, typeChecker, sourceFile);
                const extension = target.getFileExtension();
                const transpiler = new Transpiler(target);

                // declare last instances
                lastSourceFile = sourceFile;
                lastTarget = target;

                // transpile this file
                let transpiledCode = transpiler.transpile(sourceFile);

                // restore replacements
                transpiledCode = TranspilerFunctions.restoreReservedChars(transpiledCode);

                // output the transpiled code into the destination file
                this.writeDestinationFile(sourceFile, transpiledCode, extension);
            });

            // run post project transpile
            if (lastTarget.postProjectTranspile(this.writtenFileStack)) {

                return this.writtenFileStack.length;
            } else {

                return false;
            }
        } catch (e) {

            // check for unsupported error
            if (e instanceof ErrorWithNode) {

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
     * @param sourcefile the original source file
     * @param transpiled the transpiled source code
     * @param extension the target file extension
     */
    private writeDestinationFile(sourcefile: ts.SourceFile, transpiled: string, extension: string): void {

        const filePath = path.resolve(sourcefile.fileName);

        // remove the cwd from the file path
        const partOfFilePath = filePath.replace(this.project.rootDir, "");
        const destinationDir = path.dirname(path.join(this.project.rootDir, path.basename(this.project.outDir), partOfFilePath)).replace(this.project.stripOutDir, "");

        // creat that dir
        shelljs.mkdir("-p", destinationDir);

        // write the file
        const destinationFileName = path.join(destinationDir, path.basename(filePath, ".ts") + `.${extension}`);

        // write the file!
        fs.writeFileSync(destinationFileName, transpiled);

        // add the file to the written file stack
        this.writtenFileStack.push({
            sourcefile,
            generatedFileName: destinationFileName
        });
    }
}
