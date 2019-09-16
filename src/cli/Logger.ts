import { CommandLineColors } from "./CommandLineColors";

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
}
