import { OptionDefinition } from "command-line-usage";
import * as commandLineUsage from "command-line-usage";
import * as commandLineArgs from "command-line-args";
import { TargetFactory, SupportedTargets } from "../target/TargetFactory";
import { JsonReader } from "../config/json/JsonReader";
import { Project } from "../config/Project";
import { Reader } from "../config/Reader";
import { ArgumentReader } from "../config/argument/ArgumentReader";
import { Compiler } from "../compiler/Compiler";
import { CommandLineColors } from "./CommandLineColors";
import { ValidationError } from "../error/ValidationError";
import { ExternalModuleService } from "../compiler/ExternalModuleService";
import { FileWatcher } from "./FileWatcher";
import { Logger } from "./Logger";

// tslint:disable-next-line
const packageJson = require("../../package.json");

declare type ProgramArguments = {
    help: boolean,
    project: string,
    target: string,
    file: string,
    watch: boolean
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
            name: "file",
            alias: "f",
            type: String,
            description: "The file that shoule be transpiled",
            typeLabel: "<file.ts>"
        }, {
            name: "watch",
            alias: "w",
            type: Boolean,
            description: "Watches over edited and created files to automaticly trigger the transpiling process"
        }
    ];

    /**
     * the given program arguments
     */
    private programArguments: ProgramArguments;

    /**
     * the current project reference
     */
    private currentProject: Project;

    /**
     * the file watcher instance
     */
    private fileWatcher: FileWatcher;

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

        // get the project data
        const project = this.getProjectConfig();

        // check for a valid project var
        if (project === false) {
            return false;
        }

        // print an execution header
        this.printProgramExecuteInfo();

        // save project reference
        this.currentProject = project;

        // watch for file changes
        if (this.programArguments.watch) {

            this.fileWatcher = new FileWatcher(this.currentProject, this.execute.bind(this));
        }
    }

    /**
     * executes the command line tool with the given arguments
     */
    public execute(): boolean {

        // check if state is prepared
        if (!this.currentProject) {
            return false;
        }

        // construct the compiler
        const compiler = new Compiler(this.currentProject);

        // start everything else
        const result = compiler.compile(this.currentProject.parsedCommandLine.fileNames);

        // print the final result
        this.printResult(result);

        return result !== false;
    }

    /**
     * test if the cli is watching over files
     */
    public isWatchingFiles(): boolean {

        return !!this.fileWatcher;
    }

    /**
     * get the project config from either json reader or argument reader
     */
    private getProjectConfig(): Project | false {

        // delcare reader var
        let reader: Reader;

        if (this.programArguments.project) {

            reader = new JsonReader(this.programArguments.project);
        } else {

            // take the other arguments to build a project object
            reader = new ArgumentReader({
                target: this.programArguments.target as keyof SupportedTargets,
                file: this.programArguments.file
            });
        }

        // evaluate if a qhun-transpiler.json file is available
        try {

            // construct the project object
            return reader.read();

        } catch (e) {

            // catch validation errors
            if (e instanceof ValidationError) {

                // write the error
                Logger.error(e.message, undefined, CommandLineColors.RED);

                // no transpiling!
                return false;
            }
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
     * prints the final result
     * @param result the result of the transpiling process
     */
    private printResult(result: number | boolean): void {

        if (typeof result === "number") {

            // print the embeded external modules
            const externalModuleService = ExternalModuleService.getInstance();
            const embededModules = Object.keys(externalModuleService.getAvailableExternalModules());

            // only print something about external modules when some are referenced
            if (embededModules.length > 0) {
                embededModules.forEach(moduleName => {
                    Logger.log(`Added ${moduleName} as external module.`, undefined, CommandLineColors.GREEN);
                });
            }

            Logger.log(`Successfully transpiled ${result} files.`, undefined, CommandLineColors.GREEN);
        } else {
            Logger.log(`An error occured while transpiling your files.`, undefined, CommandLineColors.GREEN);
        }
    }

    /**
     * print some program metadata for the command line
     */
    private printProgramExecuteInfo(): void {

        // read package.json file
        const packageObject = packageJson;

        Logger.log();
        Logger.log(`${packageObject.name} (${packageObject.version})`, "");
        Logger.log();
    }
}
