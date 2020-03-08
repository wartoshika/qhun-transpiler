import { Config } from "../Config";
import { SourceFile } from "typescript";
import { resolve, normalize, dirname, join, sep as DIRECTORY_SEPERATOR } from "path";
import { mkdirSync, rmdirSync, existsSync, writeFileSync } from "fs";

export class FileWriter {

    private projectRoot: string;
    private fileExtension: string = "ts";

    constructor(
        parentModule: string,
        private config: Required<Config>
    ) {
        this.projectRoot = normalize(dirname(resolve(parentModule)));
    }

    /**
     * sets the new file extension for all created files
     * @param newExtension the new extension to use
     */
    public setFileExtension(newExtension: string): void {
        this.fileExtension = newExtension;
    }

    /**
     * writes the given code to the destination file based on the sourcefile's path
     * @param code the code to write
     * @param file the original source file
     */
    public writeTranspiledResult(code: string, file: SourceFile): void {

        const absoluteFilePath = normalize(resolve(file.fileName));
        const destination = this.getDestination(absoluteFilePath);
        this.createFileDirectories(destination);
        writeFileSync(destination, code, {
            encoding: "utf8"
        });
    }

    /**
     * removes the destination folder if one exists
     */
    public removeDestinationFolder(): void {

        const destination = resolve(normalize(join(this.projectRoot, this.config.outputDir)));

        if (existsSync(destination)) {
            rmdirSync(destination, {
                recursive: true
            });
        }
    }

    private createFileDirectories(destination: string): void {

        mkdirSync(dirname(destination), {
            recursive: true
        });
    }

    private getDestination(absoluteFilePath: string): string {

        let fileRelativePath = absoluteFilePath.replace(this.projectRoot, "");
        if (fileRelativePath[0] === "\\" || fileRelativePath[0] == "/") {
            fileRelativePath = fileRelativePath.substring(1);
        }

        // remove source containing folder
        if (this.config.outputRemoveSourceFolderName && fileRelativePath.startsWith(this.config.outputRemoveSourceFolderName)) {
            fileRelativePath = fileRelativePath.substring(this.config.outputRemoveSourceFolderName.length);
        }

        // build destination path
        const destinationPath = normalize(join(this.config.outputDir, DIRECTORY_SEPERATOR, fileRelativePath));

        // add project root and make the path absolute
        const fullPath = resolve(normalize(join(this.projectRoot, DIRECTORY_SEPERATOR, destinationPath)));

        // replace original file extension with the configured one
        const tempExtension = fullPath.split(".");
        const extension = tempExtension[tempExtension.length - 1];

        // get position if extension to replace the correct part
        const extensionIdx = fullPath.lastIndexOf(extension);

        // return the result with new extension
        return fullPath.substring(0, extensionIdx) + this.fileExtension;
    }
}