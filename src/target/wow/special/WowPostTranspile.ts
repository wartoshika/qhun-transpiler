import { BaseTarget } from "../../BaseTarget";
import { Target } from "../../Target";
import { CompilerWrittenFile } from "../../../compiler/CompilerWrittenFile";
import { WowPathBuilder } from "./WowPathBuilder";
import { WowConfig } from "../WowConfig";
import * as path from "path";
import * as fs from "fs";

export interface WowPostTranspile extends BaseTarget<WowConfig>, Target, WowPathBuilder { }

export class WowPostTranspile implements Partial<Target> {

    public postProjectTranspile(files: CompilerWrittenFile[]): boolean {

        // get all file names for the toc
        const tocFileNames = files.map(file => {

            // get the relative  file path
            const relativePath = this.getFinalPath(file.sourcefile.fileName, false, false);

            // append the file extension suffix
            return `${relativePath}.${this.getFileExtension()}`;
        });

        // get the destination root path for the toc file
        const destinationRootPath = path.join(this.project.rootDir, path.basename(this.project.outDir));

        // generate toc content
        const tocFileContent: string[] = [
            this.getTocFileMetaHeader(),
            "",
            ...tocFileNames
        ];

        // write the toc file
        const tocPath = path.join(destinationRootPath, this.sanitizeTocFileName()) + ".toc";
        try {
            fs.writeFileSync(tocPath, tocFileContent.join("\n"));
        } catch (e) {

            // write the error
            console.error("Error while writing the TOC file. Error was:");
            console.error(e);
            return false;
        }

        return true;
    }

    /**
     * returns the project name sanitized to fit the name conversion
     */
    private sanitizeTocFileName(): string {

        return this.project.name
            .replace(/[^a-z0-9\_\-]/ig, "")
            .replace(/\-/, "_");
    }

    /**
     * generates a toc file metadata line
     * @param visibleName the visible name in the toc file
     * @param value the value of the name
     */
    private getTocFileMetadataLine(visibleName: string, value: string | number): string {

        return `## ${visibleName}: ${value}`;
    }

    /**
     * generates the toc file meta header
     */
    private getTocFileMetaHeader(): string {

        // construct the toc meta string
        const tocFileContent: string[] = [
            this.getTocFileMetadataLine("Interface", this.project.config.interface),
            this.getTocFileMetadataLine("Title", this.project.config.visibleName),
            this.getTocFileMetadataLine("Author", this.project.author),
            this.getTocFileMetadataLine("Version", this.project.version),
            this.getTocFileMetadataLine("Notes", this.project.description)
        ];

        // add optional toc meta content
        if (this.project.config.optionalDependencies && this.project.config.optionalDependencies.length > 0) {
            this.getTocFileMetadataLine("OptionalDeps", this.project.config.optionalDependencies.join(", "));
        }
        if (this.project.config.dependencies && this.project.config.dependencies.length > 0) {
            this.getTocFileMetadataLine("Dependencies", this.project.config.dependencies.join(", "));
        }
        if (this.project.config.savedVariables && this.project.config.savedVariables.length > 0) {
            this.getTocFileMetadataLine("SavedVariables", this.project.config.savedVariables.join(", "));
        }
        if (this.project.config.savedVariablesPerCharacter && this.project.config.savedVariablesPerCharacter.length > 0) {
            this.getTocFileMetadataLine("SavedVariablesPerCharacter", this.project.config.savedVariablesPerCharacter.join(", "));
        }

        return tocFileContent.join("\n");
    }
}
