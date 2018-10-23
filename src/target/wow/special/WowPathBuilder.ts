import { BaseTarget } from "../../BaseTarget";
import { Target } from "../../Target";
import * as path from "path";
import { WowConfig } from "../WowConfig";
import { SourceFile } from "../../../compiler/SourceFile";
import * as md5 from "md5";
import * as fs from "fs";

export interface WowPathBuilder extends BaseTarget<WowConfig>, Target { }

/**
 * a class that handles path building relative to the project root
 */
export class WowPathBuilder {

    public getFilePath(sourceFile: SourceFile): string {

        // prepare the path
        const preparedPath = path.resolve(sourceFile.fileName)
            // to unix style dir sep
            .replace(/\\/g, "/")
            // remove extension
            .replace(/\.tsx?$/, "");

        // build the hash of the absolute path
        return md5(preparedPath);
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

        // build the hash
        return md5(absolutePath);
    }
}
