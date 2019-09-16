import { ApiOptions } from "./ApiOptions";
import { Compiler } from "../compiler/Compiler";
import { FileWatcher } from "./FileWatcher";
import { DefaultConfig } from "../config/DefaultConfig";
import { SupportedTargets } from "../target/TargetFactory";
import { TranspilePipeline } from "./TranspilePipeline";
import { CompileResult } from "../compiler/CompileResult";
import { Logger } from "../cli/Logger";
import { ErrorWithNode } from "../error/ErrorWithNode";
import { CommandLineColors } from "../cli/CommandLineColors";
import { CommandLine } from "../cli/CommandLine";

import { Observable, TeardownLogic } from "rxjs";

import * as fs from "fs";
import * as ts from "typescript";

export class Api<T extends keyof SupportedTargets> {

    /**
     * the currently used compiler instance
     */
    private compiler: Compiler<T>;

    constructor(
        target: T,
        private readonly options: ApiOptions<T> = { entrypoint: "./src/index.ts" }
    ) {

        // null check
        if (typeof this.options.configuration !== "object" || this.options.configuration === null) {
            this.options.configuration = {};
        }

        // save target
        this.options.configuration.target = target;

        // print cli head
        CommandLine.printHead();
    }

    /**
     * transpiles the given project or files and outputs a list of filenames that have been created or altered
     */
    public transpile(): Observable<TranspilePipeline> {

        return new Observable(observer => {

            // tslint:disable-next-line no-unused-expression
            const unsubscribe: TeardownLogic = { unsubscribe: () => undefined };

            try {

                // check if the options are valid
                if (!this.assertOptions()) {
                    observer.error("Given options are not valid!");
                    observer.complete();
                    return unsubscribe;
                }

                // build project
                const project = DefaultConfig.apiOptionsToProject(this.options);

                // construct the compiler
                this.compiler = new Compiler(project);

                // other work will be done by the internal transpiler
                observer.next(new TranspilePipeline(project, this.internalTranspile(), this.compiler.postProjectTranspile.bind(this.compiler)));

                // bind watcher if actiavted
                if (this.options.watch) {

                    // tslint:disable-next-line no-unused-expression
                    new FileWatcher(project, () => {

                        try {
                            observer.next(new TranspilePipeline(project, this.internalTranspile(), this.compiler.postProjectTranspile.bind(this.compiler)));
                        } catch (e) {
                            this.printError(e);
                        }
                    });
                } else {
                    observer.complete();
                }

            } catch (e) {
                this.printError(e);
                observer.complete();
            }

            // return teardown logic
            return unsubscribe;
        });
    }

    private internalTranspile(): CompileResult[] {

        const result = this.compiler.compile([this.options.entrypoint]);
        if (!result) {

            throw new Error("Error while transpiling your sourcecode!");
        }

        return result;
    }

    private assertOptions(): boolean {

        // check if the entrypoint is valid
        if (!fs.existsSync(this.options.entrypoint)) {
            Logger.error("Unable to find your entry file. Searched for " + this.options.entrypoint);
            return false;
        }

        return true;
    }

    private printError(e: Error): void {

        if (e instanceof ErrorWithNode) {

            const sourceFile = e.node.getSourceFile();
            const position = ts.getLineAndCharacterOfPosition(sourceFile, e.node.pos);

            Logger.error();
            Logger.error(e.message, "[Error] ", CommandLineColors.RED);
            Logger.log(`File: ${sourceFile.fileName}`, " at ");
            Logger.log(`Line: ${position.line + 1}, Column: ${position.character}`, " at ");
            Logger.error();
        } else {

            Logger.error(e.message);
        }
    }


}
