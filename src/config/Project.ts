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
}
