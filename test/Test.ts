import { Config } from "../src/config/Config";
import { SupportedTargets, TargetFactory, SupportedTargetConfig } from "../src/target/TargetFactory";
import { Project } from "../src/config/Project";
import { Transpiler } from "../src/transpiler/Transpiler";
import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import { Target } from "../src/target/Target";
import { DefaultConfig } from "../src/config/DefaultConfig";

const libSource = fs.readFileSync(path.join(path.dirname(require.resolve("typescript")), "lib.es6.d.ts")).toString();

export abstract class Test {

    protected lastTarget: Target;
    protected lastProject: Project;

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
     * an inline transpiler function
     * @param target the target 
     * @param code the code to transpile into the target language
     * @param config the optional config used while transpiling
     * @param addDeclarations add declaration code into transpiling result
     */
    protected transpile<K extends keyof SupportedTargets>(target: K, code: string, config?: SupportedTargetConfig[K], addDeclarations: boolean = false): string[] {

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
        this.lastProject = this.lastProject || this.getProject(target, config);

        // build target
        const targetFactory = new TargetFactory();
        const targetTranspiler = targetFactory.create(target, this.lastProject, program.getTypeChecker(), program.getSourceFile("test.ts"));
        this.lastTarget = targetTranspiler;

        // build transpiler
        const transpiler = new Transpiler(targetTranspiler);

        // return the transpiled code
        return transpiler
            .transpile(program.getSourceFile("test.ts"), addDeclarations)
            .split("\n")
            .filter(line => !!line);
    }
}