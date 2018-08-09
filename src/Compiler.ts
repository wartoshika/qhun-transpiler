import { Project } from "./config/Project";
import * as ts from "typescript";
import { TargetFactory } from "./target/TargetFactory";
import { Transpiler } from "./transpiler/Transpiler";

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
        const program = ts.createProgram(files, this.project.compilerOptions);
        const typeChecker = program.getTypeChecker();

        // create the transpiling target
        const targetFactory = new TargetFactory();
        const target = targetFactory.create(this.project.target, this.project, typeChecker);

        // create the transpiler
        const transpiler = new Transpiler(target);

        // iterate over every source file
        program.getSourceFiles().forEach(sourceFile => {

            // transpile this file
            const transpiledCode = transpiler.transpile(sourceFile);

            console.log("transpiled: ", transpiledCode);
        });

        return true;
    }
}
