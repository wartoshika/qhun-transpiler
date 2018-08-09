import { Config } from "../src/config/Config";
import { SupportedTargets, TargetFactory } from "../src/target/TargetFactory";
import { Project } from "../src/config/Project";
import { Transpiler } from "../src/transpiler/Transpiler";
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

    /**
     * get a transpiler target
     * @param target the target to get
     * @param config the optional project config
     */
    protected getTarget<T extends keyof SupportedTargets, C extends Config>(target: T, config?: C): SupportedTargets[T] {

        const targetFactory = new TargetFactory();
        return targetFactory.create(target, this.getProject(target, config), this.getTypeChecker());
    }

    /**
     * get the transpiler instance
     * @param target the target to get
     * @param config the optional project config
     */
    protected getTranspiler<T extends keyof SupportedTargets, C extends Config>(target: T, config?: C): Transpiler {

        return new Transpiler(this.getTarget(target, config));
    }

    /**
     * creates a sorucefile from a code base
     * @param code the code to put into the created source file
     */
    protected getSourceFile(code: string): ts.SourceFile {

        return ts.createSourceFile("test.ts", code, ts.ScriptTarget.ESNext);
    }

    /**
     * transpiles the given code using the given transpiler. it also splits the string by new line char
     * @param transpiler the transpile to use
     * @param code the code to transpile
     */
    protected transpile(transpiler: Transpiler, code: string): string[] {

        return transpiler.transpile(this.getSourceFile(code)).split("\n");
    }
}