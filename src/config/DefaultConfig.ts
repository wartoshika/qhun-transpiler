import * as ts from "typescript";
import { Project } from "./Project";
import * as path from "path";
import { Config } from "./Config";
import { StaticReflection } from "./StaticReflection";
import { SupportedTargets, SupportedTargetConfig } from "../target/TargetFactory";
import { DefaultConfigGetter } from "./DefaultConfigGetter";
import { LuaDefaultConfig } from "../target/lua/LuaDefaultConfig";
import { WowDefaultConfig } from "../target/wow/WowDefaultConfig";
import { UnsupportedError } from "../error/UnsupportedError";

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
        const defaultConfigBlock = DefaultConfig.defaultConfigGetter(givenProject.target).getDefaultConfig();
        Object.keys(defaultConfigBlock).forEach(key => {

            if (typeof configBlock[key as keyof Partial<C>] === "undefined") {
                configBlock[key as keyof Partial<C>] = defaultConfigBlock[key];
            }
        });

        // add static reflection as global default
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
            stripOutDir: givenProject.stripOutDir ? givenProject.stripOutDir : "src",
            rootDir: givenProject.rootDir ? givenProject.rootDir : path.resolve("."),
            skipExternalModuleCheck: typeof givenProject.skipExternalModuleCheck === "boolean" ? givenProject.skipExternalModuleCheck : false,
            parsedCommandLine: givenProject.parsedCommandLine ? givenProject.parsedCommandLine : {
                fileNames: [],
                options: DefaultConfig.getDefaultCompilerOptions()
            }
        } as Project;
    }

    /**
     * get the default config block entry for the given target
     * @param target the target to get the getter class from
     */
    public static defaultConfigGetter<T extends keyof SupportedTargets>(target: T): DefaultConfigGetter<SupportedTargetConfig[T]> {

        switch (target) {
            case "lua":
                return new LuaDefaultConfig() as DefaultConfigGetter<SupportedTargetConfig[T]>;
            case "wow":
                return new WowDefaultConfig() as DefaultConfigGetter<SupportedTargetConfig[T]>;
            default:
                throw new UnsupportedError(`A default config getter could not be found for the target ${target}`, null, true);
        }
    }
}
