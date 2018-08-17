import { Project } from "../config/Project";
import * as ts from "typescript";
import { TargetFactory } from "../target/TargetFactory";
import { Transpiler } from "../transpiler/Transpiler";
import { UnsupportedError } from "../error/UnsupportedError";
import { CompilerWrittenFile } from "./CompilerWrittenFile";

import * as path from "path";
import * as fs from "fs";
import * as shelljs from "shelljs";
import { Target } from "../target/Target";

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
     * @returns true if the compiling and transpiling was successfull
     */
    public compile(files: string[]): boolean {

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
                const transpiledCode = transpiler.transpile(sourceFile);

                // output the transpiled code into the destination file
                this.writeDestinationFile(sourceFile, transpiledCode, extension);
            });

            // run post project transpile
            return lastTarget.postProjectTranspile(this.writtenFileStack);
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
