import { OptionDefinition } from "command-line-usage";
import * as commandLineUsage from "command-line-usage";
import * as commandLineArgs from "command-line-args";
import { Logger } from "./Logger";
import * as fs from "fs";
import { CommandLineColors } from "./CommandLineColors";

// tslint:disable-next-line
const packageJson = require("../../package.json");

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

        // read package.json file
        const packageObject = packageJson;

        console.log(commandLineUsage([
            {
                header: `${packageObject.name} (${packageObject.version})`,
                content: packageObject.description
            }, {
                header: "Command line arguments",
                optionList: this.argumentDefinition
            }, {
                header: "Info",
                content: `{underline Licence}: ${packageObject.license}\n{underline Author}: ${packageObject.author}`
            }
        ]));
    }

    /**
     * initialized nessesary files for the transpiling process
     */
    private init(): void {

        if (!fs.existsSync("./qhun-transpiler.js")) {
            fs.writeFileSync("./qhun-transpiler.js", initFile.default);
            Logger.log("The file  qhun-transpiler.js  has been created!", "> ", CommandLineColors.GREEN);
        } else {
            Logger.log("This project allready contains a  qhun-transpiler.js  file.", "> ", CommandLineColors.RED);
        }
    }
}
