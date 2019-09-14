import { BaseTarget } from "../../BaseTarget";
import { Target } from "../../Target";
import * as path from "path";
import { SourceFile } from "../../../compiler/SourceFile";
import * as fs from "fs";

export interface WowPathBuilder extends BaseTarget, Target { }

/**
 * a class that handles path building relative to the project root
 */
export class WowPathBuilder {

    public getFilePath(sourceFile: SourceFile): string {

        // prepare the path
        const preparedPath = path.resolve(sourceFile ? sourceFile.fileName : "")
            // to unix style dir sep
            .replace(/\\/g, "/")
            // remove extension
            .replace(/\.tsx?$/, "");

        // build the final path
        return this.resolveRelativeRootPath(preparedPath);
    }

    /**
     * builds the final path for import and exports relative to the project root
     * @param sourceFile the related sourcefile
     * @param givenPath the given path of the required file relative to the current source file
     */
    public getImportPath(sourceFile: SourceFile, givenPath: string): string {

        // remove quotes from given path
        const buildPath = this.removeQuotes(givenPath);

        // build absolute path
        let absolutePath: string;

        // check for external modules
        if (buildPath[0] !== ".") {

            // from project root -> node_modules -> required file
            absolutePath = path.join(this.project.rootDir, "node_modules", buildPath);

        } else {

            // from given sourcefile relative to required file
            absolutePath = path.normalize(path.join(path.dirname(sourceFile.fileName), buildPath));
        }

        // resolve path for win/unix os
        absolutePath = path.resolve(absolutePath);

        // add an index file path if the targeted file is a directory
        try {
            fs.lstatSync(path.resolve(absolutePath) + ".ts");
        } catch (e) {
            absolutePath += "/index";
        }

        // change dir sep style
        absolutePath = absolutePath.replace(/\\/g, "/");

        // generate unique path name
        return this.getUniquePathNameForFile(absolutePath);
    }

    /**
     * creates a unique projectwide name for an import file
     * @param absolutePath the absolute path to the file
     */
    public getUniquePathNameForFile(absolutePath: string): string {

        // avoid possible symlink problems
        try {
            absolutePath = fs.realpathSync(absolutePath + ".ts");
        } catch (e) {
            absolutePath = `${absolutePath}.ts`;
        }

        // find existing file import name
        let name = this.keyValueStorage[absolutePath];
        if (name) {
            return name;
        }

        // generate a new one
        name = this.generateUniqueVariableName(path.basename(absolutePath, ".ts"));
        this.keyValueStorage[absolutePath] = name;

        return name;
    }

    /**
     * removes the project root path from the current path without leading slash
     */
    private resolveRelativeRootPath(currentPath: string): string {

        return currentPath
            // remove root path
            .replace(this.project.rootDir.replace(/\\/g, "/"), "")
            // remove leading slash
            .replace(/^\//, "");
    }

}
