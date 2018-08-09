import { OptionDefinition } from "command-line-usage";
import * as commandLineUsage from "command-line-usage";
import * as commandLineArgs from "command-line-args";
import * as fs from "fs";
import { TargetFactory, SupportedTargets } from "./target/TargetFactory";
import { JsonReader } from "./config/JsonReader";
import { Project } from "./config/Project";
import { Reader } from "./config/Reader";
import { ArgumentReader } from "./config/ArgumentReader";
import { Compiler } from "./Compiler";

declare type ProgramArguments = {
    help: boolean,
    project: string,
    target: string,
    entry: string
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
            name: "project",
            alias: "p",
            type: String,
            description: "A path to a qhun-transpiler.json file",
            typeLabel: "<qhun-transpiler.json>"
        }, {
            name: "target",
            alias: "t",
            type: String,
            description: "A target language. Can be: " + Object.keys(TargetFactory.supportedTargets).join(", ")
        }, {
            name: "entry",
            alias: "e",
            type: String,
            description: "The entry file",
            typeLabel: "<entryFile.ts>"
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
        args: string[]
    ) {

        // parse arguments
        this.programArguments = commandLineArgs(this.argumentDefinition, {
            argv: args
        }) as ProgramArguments;
    }

    /**
     * executes the command line tool with the given arguments
     */
    public execute(): boolean {

        // evaluate help page
        if (this.programArguments.help) {
            this.printHelp();
            return true;
        }

        // build a project reader
        let reader: Reader;

        // evaluate if a qhun-transpiler.json file is available
        if (this.programArguments.project) {

            reader = new JsonReader(this.programArguments.project);
        } else {

            // take the other arguments to build a project object
            reader = new ArgumentReader({
                target: this.programArguments.target as keyof SupportedTargets,
                entry: this.programArguments.entry
            });
        }

        // construct the project object
        const project: Project = reader.read();

        // construct the compiler
        const compiler = new Compiler(project);

        // start everything else
        return compiler.compile([project.entry]);
    }

    /**
     * prints the help page
     */
    private printHelp(): void {

        // read package.json file
        const packageFile = fs.readFileSync(__dirname + "/../package.json").toString();
        const packageObject = JSON.parse(packageFile);

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

}
