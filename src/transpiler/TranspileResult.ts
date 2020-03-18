import { SourceFile } from "typescript";
import { FileWriter } from "../util/FileWriter";
import { TranspileMessage } from "../constraint";
import { CommandLineColors } from "../util/CommandLineColors";
import { NodeUtil } from "../util/NodeUtil";

interface FileResult {

    /**
     * the source file that has been transpiled
     */
    readonly sourceFile: SourceFile;

    /**
     * original file name including extension excluding directories
     */
    originalFileName: string;

    /**
     * original absolute path to the file including its name and extension
     */
    originalFilePath: string;

    /**
     * new file name including extension excluding directories
     */
    newFileName: string;

    /**
     * new absolute path to the file including its name and extension
     */
    newFilePath: string;

    /**
     * the transpiled source code of the source file
     */
    transpiledCode: string;
}

export class TranspileResult {

    private result: FileResult[] = [];

    constructor(
        private fileWriter: FileWriter,
        private warnings: () => TranspileMessage[],
        private errors: () => TranspileMessage[]
    ) { }

    /**
     * add the given transpiled file to the result stack
     * @param file the file into to add
     */
    public addFile(...file: FileResult[]): this {

        this.result.push(...file);
        return this;
    }

    /**
     * get all occured warnings
     */
    public getWarnings(): TranspileMessage[] {
        return this.warnings();
    }

    /**
     * get all occured errors
     */
    public getErrors(): TranspileMessage[] {
        return this.errors();
    }

    /**
     * transforms the current result set and change informations like
     * the source code or file names
     * @param transformer the transformer callback
     */
    public transform(transformer: (result: FileResult, index: number) => FileResult): this {

        this.result.map(transformer);
        return this;
    }

    /**
     * converts the result set to a map
     * - key is the new absolute file path
     * - value is the transpiled source code
     */
    public toMap(): { [fileName: string]: string } {

        const map: { [fileName: string]: string } = {};
        this.result.forEach(result => map[result.newFilePath] = result.transpiledCode);
        return map;
    }

    /**
     * persists all files in the current result set.
     * @param clearOutputFolder flag if the output directory should be cleared before saving
     */
    public persist(clearOutputFolder: boolean = true): this {

        if (clearOutputFolder) {
            this.fileWriter.removeDestinationFolder();
        }
        this.result.forEach(result => {
            this.fileWriter.writeTranspiledResult(result.transpiledCode, result.sourceFile);
        });

        return this;
    }

    /**
     * checks if errors have occured. if so they will printed and the program will exit
     */
    public checkForErrors(): this {

        const errors = this.getErrors();
        if (errors.length > 0) {
            this.printTranspilerMessage("Error while transpiling your code", CommandLineColors.RED, errors);

            // empty line
            console.log();

            // exit program
            process.exit(1);
        }
        return this;
    }

    /**
     * prints a transpiling statistic including the file names, sizes and occured warnings
     * @param full flag to include every file in the report instead of the most interesting
     * @param ignoreWarnings flag to ignore warnings
     */
    public printStatistic(full: boolean = false, ignoreWarnings: boolean = false): this {

        // console.log(this.result[0]);

        const warnings = this.getWarnings();
        if (ignoreWarnings === false && warnings.length > 0) {

            this.printTranspilerMessage("Finished with warnings", CommandLineColors.YELLOW, warnings);
        } else if (warnings.length === 0) {

            // small success message
            console.info(
                CommandLineColors.GREEN, "Successfully transpiled", CommandLineColors.RESET,
                this.result.length,
                CommandLineColors.GREEN, `file${this.result.length > 1 ? "s" : ""}`, CommandLineColors.RESET
            );
        }

        // empty line
        console.log();

        return this;
    }

    private printTranspilerMessage(title: string, color: CommandLineColors, messages: TranspileMessage[]): void {

        console.warn(color, "=".repeat(title.length), CommandLineColors.RESET);
        console.warn(color, title, CommandLineColors.RESET);
        console.warn(color, "=".repeat(title.length), CommandLineColors.RESET);

        // print each message
        messages.forEach((message, index) => {
            const position = NodeUtil.getNodeFileAndPosition(message.node);
            console.warn(color, `[${index + 1}] `, message.message, position, CommandLineColors.RESET);
        });
    }
}
