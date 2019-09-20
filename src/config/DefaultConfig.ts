import { Project } from "./Project";
import { SupportedTargets, SupportedTargetConfig } from "../target/TargetFactory";
import { DefaultConfigGetter } from "./DefaultConfigGetter";
import { LuaDefaultConfig } from "../target/lua/LuaDefaultConfig";
import { WowDefaultConfig } from "../target/wow/WowDefaultConfig";
import { UnsupportedError } from "../error/UnsupportedError";
import { ApiOptions } from "../api/ApiOptions";
import { ApiConfiguration } from "../api/ApiConfiguration";

import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";

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

    public static apiOptionsToProject(options: ApiOptions<any>): Required<Project> {

        const compilerOptions = options.compilerOptions ? options.compilerOptions : DefaultConfig.getDefaultCompilerOptions();
        const rootDir = fs.realpathSync(".");
        return {
            ...options,
            compilerOptions: options.compilerOptions ? options.compilerOptions : DefaultConfig.getDefaultCompilerOptions(),
            overwrite: options.overwrite ? options.overwrite : {},
            watch: typeof options.watch === "boolean" ? options.watch : false,
            outDir: compilerOptions.outDir || "dist",
            rootDir: rootDir,
            configuration: DefaultConfig.mergeDefaultConfiguration(options.configuration, rootDir)
        };
    }

    public static mergeDefaultConfiguration(configuration: ApiConfiguration<any>, rootDir: string): Required<ApiConfiguration<any>> {

        // configuration given?
        if (!configuration) {
            configuration = {};
        }

        if (!configuration.project) {

            // create the base object
            configuration.project = {} as any;
        }

        // merge with existing project settings
        // read from package.json file
        configuration.project = Object.assign(DefaultConfig.readPackageJson(rootDir), configuration.project);

        const configGetter = DefaultConfig.defaultConfigGetter(configuration.target);

        return {
            project: configuration.project,
            directoryWithSource: configuration.directoryWithSource ? configuration.directoryWithSource : "src",
            printFileHeader: typeof configuration.printFileHeader === "boolean" ? configuration.printFileHeader : false,
            targetConfig: configuration.targetConfig ? configuration.targetConfig : configGetter.getDefaultConfig(),
            target: configuration.target
        };
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

    private static readPackageJson(rootDir: string): ApiConfiguration<any>["project"] {

        const pathToPackageJson = path.resolve(path.join(rootDir, "package.json"));
        if (!fs.existsSync(pathToPackageJson)) {
            throw new Error("Unable to find a package.json file in the project root dir! Looked for " + pathToPackageJson);
        }
        const packageJson = JSON.parse(fs.readFileSync(pathToPackageJson).toString()) as any;
        return {
            author: packageJson.author,
            description: packageJson.description,
            license: packageJson.license,
            name: packageJson.name,
            version: packageJson.version
        };
    }
}
