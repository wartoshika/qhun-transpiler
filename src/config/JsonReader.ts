import { Reader } from "./Reader";
import { Project } from "./Project";
import { FileNotExistsError } from "../error/FileNotExistsError";
import * as fs from "fs";
import * as ts from "typescript";

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
            throw new FileNotExistsError(`The given qhun-cli.json file does not exists. Given file was: ${this.filePath}`);
        }

        // read the data
        const jsonString = fs.readFileSync(this.filePath).toString();

        // parse to json and read every data part
        let project: Project;
        try {

            // parse json
            const jsonData: Project = JSON.parse(jsonString);

            // read into the project object
            project = {
                name: jsonData.name,
                author: jsonData.author,
                compilerOptions: {
                    moduleResolution: ts.ModuleResolutionKind.NodeJs,
                    target: ts.ScriptTarget.ES2015
                },
                config: jsonData.config,
                description: jsonData.description,
                entry: jsonData.entry,
                licence: jsonData.licence,
                outDir: jsonData.outDir,
                printFileHeader: jsonData.printFileHeader,
                target: jsonData.target,
                version: jsonData.version
            };

        } catch (e) {
            throw new Error(`Error while parsing the qhun-cli.json file. Error was: ${e}`);
        }

        return project;
    }
}
