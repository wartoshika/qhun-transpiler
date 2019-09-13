import { SupportedTargets, SupportedTargetConfig } from "../../target/TargetFactory";

/**
 * the project data read from the qhun-transpiler.json file
 */
export interface JsonConfig<T extends keyof SupportedTargets = "lua", C = SupportedTargetConfig[T]> {

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
     * the license of the project
     */
    licence: string;

    /**
     * the target language
     */
    target: T;

    /**
     * the path to the tsconfig.json file
     */
    tsconfig: string;

    /**
     * a longer description of the project
     */
    description: string;

    /**
     * a config block for different transpiler targets
     */
    config: C;

    /**
     * print a file header in each generated file
     */
    printFileHeader: boolean;

    /**
     * If set, this path will be strip from the destination path.
     * *example*: all your files are in a src/ folder. the transpiled program will be default outputted to dist/src/.
     * set this to src and the src folder will be ignored and all files will put into dist/
     */
    stripOutDir: string;
}
