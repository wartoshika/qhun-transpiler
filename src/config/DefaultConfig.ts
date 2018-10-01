import * as ts from "typescript";
import { Project } from "./Project";
import * as path from "path";
import { Config } from "./Config";
import { StaticReflection } from "./StaticReflection";

export class DefaultConfig {

    /**
     * get the default compiler options
     */
    public static getDefaultCompilerOptions(): ts.CompilerOptions {
        return {
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            target: ts.ScriptTarget.ES2015
        };
    }

    /**
     * merge an existing or get the default project data
     * @param givenProject the given project data
     */
    public static mergeDefaultProjectData<C extends Config = Config>(givenProject: Partial<Project<C>> = {}): Project {

        // config block defaults
        const configBlock: Partial<C> = givenProject.config || {};
        configBlock.staticReflection = configBlock.staticReflection ? configBlock.staticReflection : StaticReflection.NONE;

        return {
            author: givenProject.author ? givenProject.author : "Unknown",
            description: givenProject.description ? givenProject.description : "Unknown",
            licence: givenProject.licence ? givenProject.licence : "Unknown",
            name: givenProject.name ? givenProject.name : "Unknown",
            outDir: givenProject.outDir ? givenProject.outDir : "dist",
            target: givenProject.target ? givenProject.target : "lua",
            version: givenProject.version ? givenProject.version : "0.0.0",
            tsconfig: givenProject.tsconfig ? givenProject.tsconfig : "./tsconfig.json",
            printFileHeader: typeof givenProject.printFileHeader === "boolean" ? givenProject.printFileHeader : true,
            config: configBlock,
            stripOutDir: givenProject.stripOutDir ? givenProject.stripOutDir : "",
            rootDir: givenProject.rootDir ? givenProject.rootDir : path.resolve("."),
            parsedCommandLine: givenProject.parsedCommandLine ? givenProject.parsedCommandLine : {
                fileNames: [],
                options: DefaultConfig.getDefaultCompilerOptions()
            }
        } as Project;
    }
}
