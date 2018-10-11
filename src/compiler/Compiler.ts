import * as path from "path";
import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as ts from "typescript";

import { Project } from "../config/Project";
import { TargetFactory } from "../target/TargetFactory";
import { Transpiler } from "../transpiler/Transpiler";
import { CompilerWrittenFile } from "./CompilerWrittenFile";
import { Target } from "../target/Target";
import { TranspilerFunctions } from "../transpiler/TranspilerFunctions";
import { ErrorWithNode } from "../error/ErrorWithNode";
import { ExternalModuleService } from "./ExternalModuleService";
import { SourceFile } from "./SourceFile";

export class Compiler {

    /**
     * a stack of all written files
     */
    private writtenFileStack: CompilerWrittenFile[] = [];

    /**
     * the external module service instance
     */
    private externalModuleService: ExternalModuleService;

    /**
     * @param project the project configuration
     */
    constructor(
        private project: Project
    ) {

        this.externalModuleService = ExternalModuleService.getInstance(this.project);
    }

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

            // analyze all source files and detect external modules
            this.externalModuleService.analyseSourceFilesAndCastToSourceFile(

                // analyse all program sourcefiles
                program.getSourceFiles()
                    // that are not declaration files
                    .filter(file => !file.isDeclarationFile)
            ).forEach(sourceFile => {

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
            if (lastTarget && lastTarget.postProjectTranspile(this.writtenFileStack)) {

                return this.writtenFileStack.length;
            } else if (!lastTarget) {

                // no error has been thrown and no last target available,
                // means that no files were transpiled.
                return 0;
            }

        } catch (e) {

            // handle this error
            this.handleCompileError(e, lastSourceFile);
        }

        // compiling not successfill
        return false;
    }

    /**
     * handle compiler errors
     * @param error the error to handle
     * @param lastSourceFile the sourcefile where the error happens
     */
    private handleCompileError(error: Error, lastSourceFile: ts.SourceFile): void {

        // check for unsupported error
        if (error instanceof ErrorWithNode) {

            // get position of error
            if (error.node) {
                const position = ts.getLineAndCharacterOfPosition(lastSourceFile, error.node.pos);

                // print the error
                console.error(error.message);
                console.error(`${lastSourceFile.fileName}: Line: ${position.line + 1}, Column: ${position.character}\n${error.stack}`);
            } else {

                console.error(error.message, error.stack);
            }
        } else {

            // just log the error
            console.error(error.message, error.stack);
        }
    }

    /**
     * writes the destination file
     * @param sourcefile the original source file
     * @param transpiled the transpiled source code
     * @param extension the target file extension
     */
    private writeDestinationFile(sourcefile: SourceFile, transpiled: string, extension: string): void {

        // use the transpiler file name to make sure that external modules are written to the correct path
        const filePath = path.resolve(sourcefile.transpilerFileName);

        // remove the cwd from the file path
        const partOfFilePath = filePath.replace(this.project.rootDir, "");
        const destinationDir = path.dirname(
            path.join(this.project.rootDir, path.basename(this.project.outDir), partOfFilePath)
        ).replace(this.project.stripOutDir, "");

        // create that dir
        mkdirp.sync(destinationDir);

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
