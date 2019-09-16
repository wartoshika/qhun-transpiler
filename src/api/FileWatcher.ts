import { Project } from "../config/Project";
import * as fs from "fs";
import * as path from "path";
import * as md5 from "md5";
import * as nodeWatch from "node-watch";
import { Logger } from "../cli/Logger";
import { CompileResult } from "../compiler/CompileResult";

export class FileWatcher {

    private watchedRootPath: string;

    /**
     * contains current hash for files because multiple events throw
     * when changing a file
     */
    private fileContentHash: {
        [fileName: string]: {
            fsWait: boolean,
            md5: string
        }
    } = {};

    private changeStack: ((result: CompileResult[]) => void)[] = [];

    constructor(
        private project: Project<any>,
        private executeOnChange: (filesChanged: string[]) => any
    ) {

        // get watching directory
        this.watchedRootPath = this.getPathToWatch();

        // start fs watching
        nodeWatch.default(this.watchedRootPath, {
            recursive: true
        }, this.onFileChange.bind(this));

        // print info
        Logger.log("Starting to watch files in " + this.watchedRootPath);
    }

    public onChange(callable: (result: CompileResult[]) => void): void {
        this.changeStack.push(callable);
    }

    /**
     * builds the path to watch for file changes
     */
    private getPathToWatch(): string {

        return path.resolve(...[
            this.project.rootDir, this.project.configuration.directoryWithSource ? this.project.configuration.directoryWithSource : undefined
        ]);
    }

    /**
     * the handler for file changes
     * @param event the event name
     * @param filename the filename that has been changed
     */
    private onFileChange(event: string, filename: string): void {

        if (event !== "update" || !filename) {
            return;
        }

        // get md5 from file
        const absolutePath = filename;
        const buffer = fs.readFileSync(absolutePath);
        const fileMd5 = md5(buffer);

        // prepare fileContentHash
        this.fileContentHash[filename] = this.fileContentHash[filename] || {
            fsWait: false,
            md5: undefined
        };

        // check if file content realy has been changed
        if (this.fileContentHash[filename].fsWait === false && this.fileContentHash[filename].md5 !== fileMd5) {

            // yes, changed.
            this.executeFileChangeHandler(filename, absolutePath);

            // update md5
            this.fileContentHash[filename] = {
                md5: fileMd5,
                fsWait: true
            };

            // set fsWait to false
            setTimeout(() => {
                this.fileContentHash[filename].fsWait = false;
            }, 50);
        }
    }

    /**
     * executes the handler for file changes
     * @param filename the filename that has been changed
     * @param absolutePath the complete path of the changed file
     */
    private executeFileChangeHandler(filename: string, absolutePath: string): void {

        // print some info
        Logger.log(""); // one empty line
        Logger.log("Detected file change: " + filename.replace(this.project.rootDir, "") + " > Transpiling started.");

        const result = this.executeOnChange([absolutePath]);
        this.changeStack.forEach(callable => callable(result));
    }
}
