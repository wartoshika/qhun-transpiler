import { Config } from "./Config";
import * as ts from "typescript";
import { SupportedTargets } from "../targets/TargetFactory";

/**
 * the project data read from the qhun-transpiler.json file
 */
export interface Project<C = Config> {

    /**
     * name of the project
     */
    name: string;

    /**
     * version of the project in semver format
     */
    version: string;

    /**
     * the author of the project
     */
    author: string;

    /**
     * a longer description of the project
     */
    description?: string;

    /**
     * the license of the project
     */
    licence: string;

    /**
     * the entry file of the project
     */
    entry: string;

    /**
     * the target language
     */
    target: keyof SupportedTargets;

    /**
     * the directory name where to put the transpiled files
     */
    outDir: string;

    /**
     * print a file header in each generated file
     */
    printFileHeader?: boolean;

    /**
     * a config block for different transpiler targets
     */
    config?: C;

    /**
     * the project compiler options
     */
    compilerOptions: ts.CompilerOptions;
}
