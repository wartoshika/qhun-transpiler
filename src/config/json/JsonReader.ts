import { Reader } from "../Reader";
import { Project } from "../Project";
import { JsonConfig } from "./JsonConfig";
import { FileNotExistsError } from "../../error/FileNotExistsError";
import { UnexpectedError } from "../../error/UnexpectedError";
import * as fs from "fs";
import * as ts from "typescript";
import * as path from "path";
import { DefaultConfig } from "../DefaultConfig";

export class JsonReader implements Reader {

    constructor(
        private filePath: string
    ) { }

    /**
     * reads the qhun-transpiler.json file
     */
    public read(): Project {

        // check if the given file exists
        if (!fs.existsSync(this.filePath)) {
            throw new FileNotExistsError(`The given qhun-transpiler.json file does not exists. Given file was: ${this.filePath}`);
        }

        // read the data
        const jsonString = fs.readFileSync(this.filePath).toString();

        // parse to json and read every data part
        let project: Project;
        try {

            // parse json
            const jsonData: JsonConfig = JSON.parse(jsonString);

            // get typescript data
            const rootDir = path.resolve(path.dirname(this.filePath));
            const resolvedTsconfigPath = path.join(
                rootDir,
                jsonData.tsconfig
            );
            const tsData = this.getTsConfigJsonContent(resolvedTsconfigPath);

            // read into the project object
            project = DefaultConfig.mergeDefaultProjectData({
                name: jsonData.name,
                author: jsonData.author,
                config: jsonData.config,
                description: jsonData.description,
                licence: jsonData.licence,
                outDir: tsData.options.outDir,
                printFileHeader: jsonData.printFileHeader,
                target: jsonData.target,
                version: jsonData.version,
                tsconfig: jsonData.tsconfig,
                stripOutDir: jsonData.stripOutDir,
                rootDir,
                parsedCommandLine: tsData
            });

        } catch (e) {

            if (e instanceof FileNotExistsError) {
                throw e;
            } else {
                throw new UnexpectedError(`Error while parsing the qhun-cli.json file. Error was: ${e}`);
            }
        }

        return project;
    }

    private getTsConfigJsonContent(filePath: string): ts.ParsedCommandLine {

        // make some checks
        if (!fs.existsSync(filePath)) {
            throw new FileNotExistsError(`The declared tsconfig.json file was not found. Looking for: ${filePath}`);
        }

        // build context
        try {
            const commandLine = ts.parseCommandLine([]);
            const tsconfig = fs.readFileSync(filePath).toString();

            // read the json content
            const config = ts.parseConfigFileTextToJson(filePath, tsconfig);

            // look for errors
            if (config.error) {
                throw config.error;
            }

            // parse everything
            return ts.parseJsonConfigFileContent(
                config.config,
                ts.sys,
                path.dirname(filePath),
                commandLine.options
            );
        } catch (e) {
            throw new UnexpectedError(`Unexpected error while trying to parse the given ${filePath}. Error was: ${e.toString()}`);
        }
    }
}
