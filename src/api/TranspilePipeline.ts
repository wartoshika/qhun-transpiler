import { CompileResult } from "../compiler/CompileResult";
import { Logger } from "../cli/Logger";
import { CommandLineColors } from "../cli/CommandLineColors";

import * as ts from "typescript";
import * as path from "path";

export class TranspilePipeline {

    constructor(
        private files: CompileResult[],
        private postProjectTranspile: () => boolean
    ) { }

    /**
     * prints a basic transpiling result
     */
    public printResult(): TranspilePipeline {

        Logger.log("Successfully transpiled " + this.files.length + " files", "> ", CommandLineColors.GREEN);
        return this;
    }

    public prettyPrintResult(): TranspilePipeline {

        Logger.log("Transpiling successfull. Result: " + this.files.length + " files");

        const amountOfTopFiles = 8;
        this.files.slice(0, amountOfTopFiles).forEach(file => {
            const size = Math.round(file.generatedSourcecode.length / 1024);
            Logger.log(path.basename(file.file.fileName) + " [" + size + " KB]", " + ", CommandLineColors.GREEN);
        });

        const otherFiles = this.files.length - amountOfTopFiles;
        if (otherFiles > 0) {
            const otherFilesLength = Math.round(this.files.slice(amountOfTopFiles).reduce<number>((a, b) => a + b.generatedSourcecode.length, 0) / 1024);
            Logger.log("And " + otherFiles + " other files [" + otherFilesLength + " KB]", "   ", CommandLineColors.GREEN);
        }

        return this;

    }

    /**
     * applies a transformation for the whole project after transpiling is done.
     * this is nessecary for eg. the wow target to create the .toc file.
     */
    public applyPostProjectTranspile(): TranspilePipeline {

        Logger.log("Applying postProjectTranspile ...");
        if (!this.postProjectTranspile()) {
            throw new Error("Error in the postProjectTranspile process!");
        }
        Logger.log("PostProjectTranspile successfull", " + ", CommandLineColors.GREEN);
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
