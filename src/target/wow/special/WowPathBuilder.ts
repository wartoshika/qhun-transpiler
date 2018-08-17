import { BaseTarget } from "../../BaseTarget";
import { Target } from "../../Target";
import * as path from "path";
import * as fs from "fs";
import { WowConfig } from "../WowConfig";

export interface WowPathBuilder extends BaseTarget<WowConfig>, Target { }

/**
 * a class that handles path building relative to the project root
 */
export class WowPathBuilder {

    /**
     * builds the final path for import and exports relative to the project root
     * @param givenPath the given path of the required file relative to the current source file
     * @param addPrefix adds a project name based prefix to the path
     * @param addQuotes wrap the path with quotes, true by default
     */
    public getFinalPath(givenPath: string, addPrefix: boolean = true, addQuotes: boolean = true): string {

        // remove given quotes if available
        let stripedPath = this.removeQuotes(givenPath);

        // add an index suffix if the given path points to a directory
        if (this.isPathAFolder(stripedPath)) {
            stripedPath = path.join(stripedPath, "index");
        }

        // now get the relative path to the current source file
        const relativePath = this.getRelativeFilePath(stripedPath);

        // construct the new path
        let finalPath = `${relativePath}`;

        // check for prefix adding
        if (addPrefix) {
            finalPath = `${this.project.name}@${finalPath}`;
        }

        // check for quote wrapping
        if (addQuotes) {
            finalPath = `"${finalPath}"`;
        }

        return finalPath;
    }

    /**
     * check if the given path points to a folder directory
     * @param givenPath the given path
     */
    private isPathAFolder(givenPath: string): boolean {

        try {
            // there are three cases.
            // 1. the path is absolute, just check if it is a folder
            // 2. the given path is relative identified by a starting .
            // 3. the path points to a node_modules dependency, resolve it
            // ----------------------
            // first case, check for absolute path
            if (path.isAbsolute(givenPath)) {
                return !!fs.readdirSync(givenPath);
            } else if (givenPath[0] === ".") {

                // second case, resolve relative path to source file
                const fullPath = path.join(path.dirname(this.sourceFile.fileName), givenPath);

                // make the test
                return !!fs.readdirSync(fullPath);
            } else {

                // third case, check in the node_modules for a folder existence
                const modulePath = path.join(this.project.rootDir, "node_modules");
                return !!fs.readdirSync(path.join(modulePath, givenPath));
            }
        } catch (e) {

            // file or filder does not exists, so false it is
            return false;
        }
    }

    /**
     * get the relative path from the project root to the current file
     * @param givenPath the given path
     */
    private getRelativeFilePath(givenPath: string): string {

        // get the full path to the given path
        let fullPath: string;
        if (path.isAbsolute(givenPath)) {
            fullPath = path.resolve(givenPath);
        } else {
            fullPath = path.resolve(path.join(path.dirname(this.sourceFile.fileName), givenPath));
        }

        return fullPath
            // remove the root dir part
            .replace(this.project.rootDir, "")
            // remove windows double backslash
            .replace(/\\/g, "/")
            // remove leading slash
            .replace(/^\//, "")
            // remove striped folder name
            .replace(this.project.stripOutDir ? this.project.stripOutDir + "/" : "", "")
            // replace trailing ts extension if available
            .replace(/\.tsx?$/, "");
    }
}
