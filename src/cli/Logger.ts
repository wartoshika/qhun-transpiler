import { CommandLineColors } from "./CommandLineColors";
import * as ts from "typescript";

export class Logger {

    /**
     * logs text onto the console
     */
    public static log(message: string = "", prefix: string = "> ", color?: CommandLineColors): void {

        if (message === "") {
            prefix = "";
        }

        if (color) {
            const textToLog = `${color}%s${CommandLineColors.RESET}`;
            console.log(textToLog, `${prefix}${message}`);
        } else {
            console.log(`${prefix}${message}`);
        }
    }

    /**
     * warns text onto the console
     */
    public static warn(message: string = "", prefix: string = "> ", color?: CommandLineColors): void {

        if (message === "") {
            prefix = "";
        }

        if (color) {
            const textToLog = `${color}%s${CommandLineColors.RESET}`;
            console.warn(textToLog, `${prefix}${message}`);
        } else {
            console.warn(`${prefix}${message}`);
        }
    }

    /**
     * logs error text onto the console
     */
    public static error(message: string = "", prefix: string = "> ", color: CommandLineColors = CommandLineColors.RED): void {

        if (message === "") {
            prefix = "";
        }

        if (color) {
            const textToLog = `${color}%s${CommandLineColors.RESET}`;
            console.error(textToLog, `${prefix}${message}`);
        } else {
            console.error(`${prefix}${message}`);
        }
    }

    public static logNodePosition(node: ts.Node): void {

        const sourceFile = node.getSourceFile();
        const position = ts.getLineAndCharacterOfPosition(sourceFile, node.pos);
        Logger.log(`File: ${sourceFile.fileName}`, " at ");
        Logger.log(`Line: ${position.line + 1}, Column: ${position.character}`, " at ");
    }
}
