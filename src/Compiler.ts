import { Project } from "./config/Project";
import * as ts from "typescript";
import { TargetFactory } from "./target/TargetFactory";
import { Transpiler } from "./transpiler/Transpiler";

import * as path from "path";
import * as fs from "fs";
import * as shelljs from "shelljs";
import { Target } from "./target/Target";

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
        const target = targetFactory.create(this.project.target, this.project, typeChecker);
        const extension = target.getFileExtension();

        // create the transpiler
        const transpiler = new Transpiler(target);

        // iterate over every source file
        try {
            program.getSourceFiles().filter(file => !file.isDeclarationFile).forEach(sourceFile => {

                // transpile this file
                const transpiledCode = transpiler.transpile(sourceFile);

                // output the transpiled code into the destination file
                this.writeDestinationFile(sourceFile, transpiledCode, extension);
            });

            // everything was successfull!
            return true;
        } catch (e) {

            console.error(e);
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

        // get the root path
        const rootPath = path.resolve(path.dirname(this.project.tsconfig));
        const filePath = path.resolve(sourceFile.fileName);

        // remove the cwd from the file path
        const partOfFilePath = filePath.replace(rootPath, "");
        const destinationDir = path.dirname(path.join(rootPath, this.project.outDir, partOfFilePath)).replace(this.project.stripOutDir, "");

        // creat that dir
        shelljs.mkdir("-p", destinationDir);

        // write the file
        const destinationFileName = path.join(destinationDir, path.basename(filePath, ".ts") + `.${extension}`);

        fs.writeFileSync(destinationFileName, transpiled);
    }
}
