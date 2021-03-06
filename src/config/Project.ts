import { Config } from "./Config";
import * as ts from "typescript";
import { JsonConfig } from "./json/JsonConfig";

/**
 * the project data read from the qhun-transpiler.json file with aditional parsed data
 */
export interface Project<C = Config> extends JsonConfig<C> {

    /**
     * the parsed command line object
     */
    parsedCommandLine: Partial<ts.ParsedCommandLine>;

    /**
     * the directory name where to put the transpiled files
     */
    outDir: string;

    /**
     * the root dir of the project. this must be absolute!
     */
    rootDir: string;

    /**
     * when true, every file will be treated as internal file
     */
    skipExternalModuleCheck: boolean;
}
