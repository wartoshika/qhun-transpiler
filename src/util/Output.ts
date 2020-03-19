import { FileResult } from "../transpiler";
import { CommandLineColors } from "./CommandLineColors";
import { NodeUtil } from "./NodeUtil";
import { TranspileMessage } from "../constraint";
import { PathUtil } from "./PathUtil";
import { FileUtil } from "./FileUtil";

export class Output {

    public static fileOutputMessage(file: FileResult, index: number): void {

        let resultMessage: string = "success";
        let resultColor: CommandLineColors = CommandLineColors.GREEN;
        if (file.hasWarnings) {
            resultMessage = "warning";
            resultColor = CommandLineColors.YELLOW;
        }
        if (file.hasErrors) {
            resultMessage = "error";
            resultColor = CommandLineColors.RED;
        }

        const fileRelative = "." + PathUtil.toUnixSeparator(
            PathUtil.getRelativeToRoot(file.newFilePath)
        );
        console.info(
            `[${index + 1}]`,
            `${CommandLineColors.BRIGHT}${fileRelative}`,
            CommandLineColors.RESET, FileUtil.readableFileSize(file.newFilePath),
            `${CommandLineColors.BRIGHT + resultColor}[${resultMessage}]`,
            CommandLineColors.RESET
        );
    }

    public static transpilerMessage(title: string, color: CommandLineColors, messages: TranspileMessage[]): void {

        console.warn(CommandLineColors.BRIGHT, color, "=".repeat(title.length), CommandLineColors.RESET);
        console.warn(CommandLineColors.BRIGHT, color, title, CommandLineColors.RESET);
        console.warn(CommandLineColors.BRIGHT, color, "=".repeat(title.length), CommandLineColors.RESET);

        // print each message
        messages.forEach((message, index) => {
            const position = NodeUtil.getNodeFileAndPosition(message.node);
            console.warn(CommandLineColors.BRIGHT, color, `[${index + 1}] `, message.message, position, CommandLineColors.RESET);
        });
    }

    public static finalSuccessMessage(amountOfFiles: number): void {

        console.info(
            CommandLineColors.BRIGHT,
            CommandLineColors.GREEN, "Successfully transpiled", CommandLineColors.RESET,
            amountOfFiles,
            `${CommandLineColors.BRIGHT + CommandLineColors.GREEN}file${amountOfFiles > 1 ? "s" : ""}`, CommandLineColors.RESET
        );
    }

    public static pipelineError(e: Error): void {

        console.error(CommandLineColors.BRIGHT, CommandLineColors.RED, `============================`, CommandLineColors.RESET);
        console.error(CommandLineColors.BRIGHT, CommandLineColors.RED, `Unexpected exception occured`, CommandLineColors.RESET);
        console.error(CommandLineColors.BRIGHT, CommandLineColors.RED, `============================`, CommandLineColors.RESET);
        console.error(CommandLineColors.BRIGHT, CommandLineColors.RED, e.message, CommandLineColors.RESET);
        console.error(CommandLineColors.RED, e.stack, CommandLineColors.RESET);
        console.info();
        console.info(CommandLineColors.BRIGHT, "Please submit a bug report if you think that this is an error. In most cases this message is displayed when you have some kind of syntax errors within your source code.", CommandLineColors.RESET);
        console.info();
    }

    public static welcome(): void {

        console.info();
        console.info(CommandLineColors.BRIGHT, `${PJSON_NAME} (${PJSON_VERSION})`, CommandLineColors.RESET);
        console.info("--------------------------------------------------------------------------------------", "");
        console.info(`Visit ${PJSON_URL} for a description and help.`, " - ");
        console.info(`Please post issues at ${PJSON_BUG_URL}`, " - ");
        console.info("--------------------------------------------------------------------------------------", "");
        console.info("Thanks for using!", "   ");
        console.info();
    }
}