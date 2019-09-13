import { Config } from "../src/config/Config";
import { SupportedTargets, TargetFactory, SupportedTargetConfig } from "../src/target/TargetFactory";
import { Project } from "../src/config/Project";
import { Transpiler } from "../src/transpiler/Transpiler";
import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import { Target } from "../src/target/Target";
import { DefaultConfig } from "../src/config/DefaultConfig";
import { SourceFile } from "../src/compiler/SourceFile";

const libSource = fs.readFileSync(path.join(path.dirname(require.resolve("typescript")), "lib.es6.d.ts")).toString();

export abstract class Test {

    protected lastTarget: Target;
    protected lastProject: Project;
    protected lastProgram: ts.Program;

    /**
     * get a test project object
     */
    protected getProject<K extends keyof SupportedTargets>(target: K, config?: SupportedTargetConfig[K]): Project<SupportedTargetConfig[K]> {

        // use default config constructor
        return DefaultConfig.mergeDefaultProjectData({
            config: config,
            target: target
        }) as Project<SupportedTargetConfig[K]>;
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
     * generates a ts compiler environment
     * @param code the code to inject
     * @param testFileName the name of the test file where to inject code
     */
    protected generateProgram(code: string, testFileName: string = "test.ts"): ts.Program {

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
                if (filename === testFileName) {
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
        return ts.createProgram([testFileName], this.getCompilerOptions(), compilerHost);
    }

    /**
     * generates the given target class
     * @param target the target to create
     * @param code the code to inject
     * @param config the config to use while transpiling
     */
    protected createTarget<K extends keyof SupportedTargets>(target: K, code: string = "// test", config?: Partial<SupportedTargetConfig[K]>): SupportedTargets[K] {

        // generate a ts program
        this.lastProgram = this.generateProgram(code);
        this.lastProject = this.getProject(target, config);

        // build target
        const targetFactory = new TargetFactory();
        return targetFactory.create(target, this.lastProject, this.lastProgram.getTypeChecker(), this.lastProgram.getSourceFile("test.ts") as SourceFile, {
            version: "0.0.0"
        }, {});
    }

    /**
     * an inline transpiler function
     * @param target the target 
     * @param code the code to transpile into the target language
     * @param config the optional config used while transpiling
     * @param addDeclarations add declaration code into transpiling result
     */
    protected transpile<K extends keyof SupportedTargets>(target: K, code: string, config?: Partial<SupportedTargetConfig[K]>, addDeclarations: boolean = false): string[] {

        // create the target
        const targetTranspiler = this.createTarget(target, code, config);
        this.lastTarget = targetTranspiler;

        // build transpiler
        const transpiler = new Transpiler(targetTranspiler);

        // return the transpiled code
        return transpiler
            .transpile(this.lastProgram.getSourceFile("test.ts"), addDeclarations)
            .split("\n")
            .filter(line => !!line);
    }
}