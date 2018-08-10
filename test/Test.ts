import { Config } from "../src/config/Config";
import { SupportedTargets, TargetFactory } from "../src/target/TargetFactory";
import { Project } from "../src/config/Project";
import { Transpiler } from "../src/transpiler/Transpiler";
import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";

const libSource = fs.readFileSync(path.join(path.dirname(require.resolve("typescript")), "lib.es6.d.ts")).toString();

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
     * an inline transpiler function
     * @param target the target 
     * @param code the code to transpile into the target language
     */
    protected transpile(target: keyof SupportedTargets, code: string): string[] {

        // build compiler host
        const compilerHost = {
            directoryExists: () => true,
            fileExists: (fileName: string): boolean => true,
            getCanonicalFileName: (fileName: string) => fileName,
            getCurrentDirectory: () => "",
            getDefaultLibFileName: () => "lib.es6.d.ts",
            getDirectories: (): any[] => [],
            getNewLine: () => "\n",
            getSourceFile: (filename: string, languageVersion: any) => {
                if (filename === "test.ts") {
                    return ts.createSourceFile(filename, code, ts.ScriptTarget.Latest, false);
                }
                if (filename === "lib.es6.d.ts") {
                    return ts.createSourceFile(filename, libSource, ts.ScriptTarget.Latest, false);
                }
                return undefined;
            },
            readFile: () => "",
            useCaseSensitiveFileNames: () => false,
            writeFile: (name: string, text: string, writeByteOrderMark: any): any => null,
        };

        // build program
        const program = ts.createProgram(["test.ts"], this.getCompilerOptions(), compilerHost);

        // build target
        const targetFactory = new TargetFactory();
        const targetTranspiler = targetFactory.create(target, this.getProject(target), program.getTypeChecker());

        // build transpiler
        const transpiler = new Transpiler(targetTranspiler);

        // return the transpiled code
        return transpiler
            .transpile(program.getSourceFile("test.ts"))
            .split("\n")
            .filter(line => !!line);
    }
}