import { BaseTarget } from "../../BaseTarget";
import { Target } from "../../Target";
import { CompilerWrittenFile } from "../../../compiler/CompilerWrittenFile";
import { WowPathBuilder } from "./WowPathBuilder";
import * as path from "path";
import * as fs from "fs";
import { WowKeywords } from "../WowKeywords";

export interface WowPostTranspile extends BaseTarget, Target, WowPathBuilder { }

export class WowPostTranspile implements Partial<Target> {

    public postProjectTranspile(files: CompilerWrittenFile[]): boolean {

        // get all file names for the toc
        const tocFileNames = files.map(file => {

            // get the relative  file path
            const relativePath = file.sourcefile.targetFileNameTranspiled;

            // append the file extension suffix
            return `${relativePath}.${this.getFileExtension()}`;
        });

        // get the destination root path for the toc file
        const destinationRootPath = path.join(this.project.rootDir, path.basename(this.project.outDir));

        // create library file for imports and exports and add the created
        // file to the top of the name stack. library needs to be the first loaded file!
        this.createWowLibraryFile(destinationRootPath);
        tocFileNames.unshift(`${WowKeywords.IMPORT_LIB_NAME}.lua`);

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
     * creates a library file for wow import and exports
     * @param destinationRootPath the directory name where to store the library file
     * @return the path of the created file
     */
    private createWowLibraryFile(destinationRootPath: string): string {

        // declare the lib content
        const libContent: string = [
            `local addon, namespace = ...`,
            `local __library = {}`,
            `local __declarations = {}`,
            `function __library.declare(name, content)`,
            this.addSpacesToString(`__declarations[name] = content`, 2),
            `end`,
            `function __library.get(name)`,
            this.addSpacesToString(`return __declarations[name] or {}`, 2),
            `end`,
            `namespace.importExport = __library`
        ].join("\n");

        // build the target file path and write it
        const targetPath = path.join(destinationRootPath, `${WowKeywords.IMPORT_LIB_NAME}.lua`);
        fs.writeFileSync(targetPath, libContent);

        // return the created file name
        return targetPath;
    }

    /**
     * returns the project name sanitized to fit the name conversion
     */
    private sanitizeTocFileName(): string {

        return this.project.configuration.project.name
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
            this.getTocFileMetadataLine("Interface", this.project.configuration.targetConfig.interface),
            this.getTocFileMetadataLine("Title", this.project.configuration.targetConfig.visibleName),
            this.getTocFileMetadataLine("Author", this.project.configuration.project.author),
            this.getTocFileMetadataLine("Version", this.project.configuration.project.version),
            this.getTocFileMetadataLine("Notes", this.project.configuration.project.description)
        ];

        // add optional toc meta content
        if (this.project.configuration.targetConfig.optionalDependencies && this.project.configuration.targetConfig.optionalDependencies.length > 0) {
            tocFileContent.push(this.getTocFileMetadataLine("OptionalDeps", this.project.configuration.targetConfig.optionalDependencies.join(", ")));
        }
        if (this.project.configuration.targetConfig.dependencies && this.project.configuration.targetConfig.dependencies.length > 0) {
            tocFileContent.push(this.getTocFileMetadataLine("Dependencies", this.project.configuration.targetConfig.dependencies.join(", ")));
        }
        if (this.project.configuration.targetConfig.savedVariables && this.project.configuration.targetConfig.savedVariables.length > 0) {
            tocFileContent.push(this.getTocFileMetadataLine("SavedVariables", this.project.configuration.targetConfig.savedVariables.join(", ")));
        }
        if (
            this.project.configuration.targetConfig.savedVariablesPerCharacter &&
            this.project.configuration.targetConfig.savedVariablesPerCharacter.length > 0
        ) {
            tocFileContent.push(
                this.getTocFileMetadataLine(
                    "SavedVariablesPerCharacter",
                    this.project.configuration.targetConfig.savedVariablesPerCharacter.join(", ")
                )
            );
        }

        // addon qhun-transpiler version
        tocFileContent.push(this.getTocFileMetadataLine("X-QhunTranspilerVersion", this.qhunTranspilerMetadata.version));

        return tocFileContent.join("\n");
    }
}
