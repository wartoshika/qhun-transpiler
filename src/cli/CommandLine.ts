import { OptionDefinition } from "command-line-usage";
import * as commandLineUsage from "command-line-usage";
import * as commandLineArgs from "command-line-args";
import { Logger } from "./Logger";
import * as fs from "fs";
import { CommandLineColors } from "./CommandLineColors";

// tslint:disable-next-line
const initFile = require("./InitFile.js");

declare type ProgramArguments = {
    help: boolean,
    init: boolean
};

export class CommandLine {

    /**
     * the argument definition list
     */
    private readonly argumentDefinition: OptionDefinition[] = [
        {
            name: "help",
            alias: "h",
            type: Boolean,
            description: "Display this help message"
        }, {
            name: "init",
            type: Boolean,
            description: "Creates nessesary files to start transpiling your sourcecode"
        }
    ];

    /**
     * the given program arguments
     */
    private programArguments: ProgramArguments;

    /**
     * @param args the arguments
     */
    constructor(
        private args: string[]
    ) {

        // parse arguments
        this.programArguments = commandLineArgs(this.argumentDefinition, {
            argv: args
        }) as ProgramArguments;
    }

    // tslint:disable-next-line member-ordering
    public static printHead(): void {

        Logger.log();
        Logger.log(`${PJSON_NAME} (${PJSON_VERSION})${CommandLineColors.RESET} by ${PJSON_AUTHOR}`, "", CommandLineColors.BRIGHT);
        Logger.log("--------------------------------------------------------------------------------------", "");
        Logger.log(`Visit ${PJSON_URL} for a description and help.`, " - ");
        Logger.log(`Please post issues at ${PJSON_BUG_URL}`, " - ");
        Logger.log("--------------------------------------------------------------------------------------", "");
        Logger.log("Thanks for using!", "   ");
        Logger.log();
    }

    /**
     * prepares the execution of the transpiling process
     */
    public prepare(): boolean {

        // evaluate help page
        if (this.programArguments.help || this.args.length === 0) {
            this.printHelp();
            return true;
        }

        if (this.programArguments.init) {
            this.init();
            return true;
        }
    }

    /**
     * prints the help page
     */
    private printHelp(): void {

        console.log(commandLineUsage([
            {
                header: `${PJSON_NAME} (${PJSON_VERSION})`,
                content: PJSON_DESCRIPTION
            }, {
                header: "Command line arguments",
                optionList: this.argumentDefinition
            }, {
                header: "Info",
                content: `{underline Licence}: ${PJSON_LICENSE}\n{underline Author}: ${PJSON_AUTHOR}`
            }
        ]));
    }

    /**
     * initialized nessesary files for the transpiling process
     */
    private init(): void {

        CommandLine.printHead();

        if (!fs.existsSync("./qhun-transpiler.js")) {
            fs.writeFileSync("./qhun-transpiler.js", initFile.default);
            Logger.log("The file  qhun-transpiler.js  has been created!", "[Success] ", CommandLineColors.GREEN);
        } else {
            Logger.error("This project allready contains a  qhun-transpiler.js  file.", "[Error] ");
        }

        // empty line
        Logger.log();
    }
}
