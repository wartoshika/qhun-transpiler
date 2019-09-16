import { CompileResult } from "../compiler/CompileResult";
import { Logger } from "../cli/Logger";
import { CommandLineColors } from "../cli/CommandLineColors";
import { Project } from "../config/Project";

export class TranspilePipeline {

    constructor(
        private project: Project<any>,
        private files: CompileResult[],
        private postProjectTranspile: () => boolean
    ) { }

    /**
     * prints a basic transpiling result
     */
    public printResult(): TranspilePipeline {

        Logger.log();
        Logger.log("Successfully transpiled " + this.files.length + " files", "> ", CommandLineColors.GREEN);
        Logger.log();
        return this;
    }

    /**
     * prints the transpiling result more prettier :)
     */
    public prettyPrintResult(): TranspilePipeline {

        Logger.log();
        Logger.log(`${this.files.length} file(s) transpiled`, "[Success] ", CommandLineColors.GREEN);

        const amountOfTopFiles = 8;
        this.files.slice(0, amountOfTopFiles).forEach(file => {
            const size = Math.round(file.generatedSourcecode.length / 1024);
            let fileName = file.file.fileName.replace(this.project.rootDir, "");
            if (fileName[0] !== "/") {
                fileName = "/" + fileName;
            }
            Logger.log(fileName + " [" + size + " KB]", " + ");
        });

        const otherFiles = this.files.length - amountOfTopFiles;
        if (otherFiles > 0) {
            const otherFilesLength = Math.round(this.files.slice(amountOfTopFiles).reduce<number>((a, b) => a + b.generatedSourcecode.length, 0) / 1024);
            Logger.log("And " + otherFiles + " other file(s) [" + otherFilesLength + " KB]", "   ");
        }

        return this;

    }

    /**
     * applies a transformation for the whole project after transpiling is done.
     * this is nessecary for eg. the wow target to create the .toc file.
     */
    public applyPostProjectTranspile(): TranspilePipeline {

        Logger.log();
        Logger.log("Applying postProjectTranspile ...", "> ");
        if (!this.postProjectTranspile()) {
            throw new Error("Error in the postProjectTranspile process!");
        }
        Logger.log("PostProjectTranspile done", "[Success] ", CommandLineColors.GREEN);
        Logger.log();
        return this;
    }

    /**
     * iterates over every file that has been transpiled
     * @param callable the callback function
     */
    public forEach(callable: (result: CompileResult) => void): TranspilePipeline {

        this.files.forEach(result => callable(result));
        return this;
    }

    /**
     * presist all current files in the pipeline
     */
    public persistAllFiles(): TranspilePipeline {

        this.files.forEach(file => file.writer(file.generatedSourcecode));
        return this;
    }
}
