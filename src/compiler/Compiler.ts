import * as path from "path";
import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as ts from "typescript";

import { Project } from "../config/Project";
import { TargetFactory, SupportedTargets } from "../target/TargetFactory";
import { Transpiler } from "../transpiler/Transpiler";
import { CompilerWrittenFile } from "./CompilerWrittenFile";
import { Target } from "../target/Target";
import { TranspilerFunctions } from "../transpiler/TranspilerFunctions";
import { ErrorWithNode } from "../error/ErrorWithNode";
import { ExternalModuleService } from "./ExternalModuleService";
import { SourceFile } from "./SourceFile";
import { QhunTranspilerMetadata } from "../target/QhunTranspilerMetadata";
import { CompileResult } from "./CompileResult";

// tslint:disable-next-line
const packageJson = require("../../package.json");

export class Compiler<T extends keyof SupportedTargets> {

    /**
     * a stack of all written files
     */
    private writtenFileStack: CompilerWrittenFile[] = [];

    /**
     * the external module service instance
     */
    private externalModuleService: ExternalModuleService;

    /**
     * a storage that exists over the lifetime of the compiler
     */
    private keyValueStorage: { [key: string]: any } = {};

    /**
     * contains the last target that has been used to transpile a file
     */
    private lastTarget: Target;

    /**
     * @param project the project configuration
     */
    constructor(
        private project: Required<Project<T>>
    ) {

        // setup external module service
        this.externalModuleService = ExternalModuleService.getInstance();
        this.externalModuleService.setProject(this.project);
    }

    /**
     * compiles the given files and transpiles them into the target language
     * @param files the files to compile and transpile
     * @returns the amount of successfully transpiled and written files.
     */
    public compile(files: string[]): CompileResult[] {

        // create a typescript program
        const program = ts.createProgram(files, this.project.compilerOptions);
        const typeChecker = program.getTypeChecker();

        // create the transpiling target
        const targetFactory = new TargetFactory();
        let lastSourceFile: ts.SourceFile;
        this.lastTarget = undefined;
        const transpilerMetadata: QhunTranspilerMetadata = this.getMetadata();
        const transpileResult: CompileResult[] = [];

        // analyze all source files and detect external modules
        this.externalModuleService.analyseSourceFilesAndCastToSourceFile(

            // analyse all program sourcefiles
            program.getSourceFiles()
                // that are not declaration files
                .filter(file => !file.isDeclarationFile)
        ).forEach(sourceFile => {

            // create the transpiler
            const target = targetFactory.create(this.project.configuration.target,
                this.project, typeChecker,
                sourceFile, transpilerMetadata,
                this.keyValueStorage
            );
            const extension = target.getFileExtension();
            const transpiler = new Transpiler(target);

            // declare last instances
            lastSourceFile = sourceFile;
            this.lastTarget = target;

            // transpile this file
            let transpiledCode = transpiler.transpile(sourceFile);

            // restore replacements
            transpiledCode = TranspilerFunctions.restoreReservedChars(transpiledCode);

            // save result
            transpileResult.push(new CompileResult(
                sourceFile,
                transpiledCode,
                (code: string) => {
                    this.writeDestinationFile(sourceFile, code, extension);
                }
            ));
        });

        // cleanup compiler vars and return the amount
        this.writtenFileStack = [];
        return transpileResult;
    }

    /**
     * apply post project transpile
     */
    public postProjectTranspile(): boolean {

        return this.lastTarget.postProjectTranspile(this.writtenFileStack);
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
        ).replace(this.project.configuration.directoryWithSource, "");

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

    /**
     * get the current transpiler metadata
     */
    private getMetadata(): QhunTranspilerMetadata {

        return {
            version: packageJson.version
        };
    }
}
