import { Config } from "../src/config/Config";
import { SupportedTargets } from "../src/target/TargetFactory";
import { Project } from "../src/config/Project";
import * as ts from "typescript";

export abstract class Test {

    /**
     * get a test project object
     */
    protected getProject<C extends Config>(target: keyof SupportedTargets, config?: C): Project<C> {

        return {
            author: "wartoshika <dev@qhun.de>",
            name: "qhun-transpiler-test",
            entry: "src/entry.ts",
            description: "description",
            licence: "MIT",
            outDir: "dist",
            target: target,
            version: "1.0.0",
            printFileHeader: false,
            compilerOptions: this.getCompilerOptions(),
            config: config || {} as C
        };
    }

    /**
     * get compiler options for tests
     */
    protected getCompilerOptions(): ts.CompilerOptions {

        return {
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            target: ts.ScriptTarget.ES2015,
            outDir: "dist"
        };
    }

    /**
     * get a typechecker instance
     */
    protected getTypeChecker(): ts.TypeChecker {

        const program = ts.createProgram([], this.getCompilerOptions());
        return program.getTypeChecker();
    }
}