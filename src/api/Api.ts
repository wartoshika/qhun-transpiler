import { ApiOptions } from "./ApiOptions";
import { Compiler } from "../compiler/Compiler";
import { FileWatcher } from "./FileWatcher";
import { DefaultConfig } from "../config/DefaultConfig";
import { SupportedTargets } from "../target/TargetFactory";
import { TranspilePipeline } from "./TranspilePipeline";
import { CompileResult } from "../compiler/CompileResult";

import { Observable } from "rxjs";

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
    }

    /**
     * transpiles the given project or files and outputs a list of filenames that have been created or altered
     */
    public transpile(): Observable<TranspilePipeline> {

        // build project
        const project = DefaultConfig.apiOptionsToProject(this.options);

        // construct the compiler
        this.compiler = new Compiler(project);

        return new Observable(observer => {

            // other work will be done by the internal transpiler
            observer.next(new TranspilePipeline(this.internalTranspile(), this.compiler.postProjectTranspile.bind(this.compiler)));

            // bind watcher if actiavted
            if (this.options.watch) {

                // tslint:disable-next-line no-unused-expression
                new FileWatcher(project, () => {

                    observer.next(new TranspilePipeline(this.internalTranspile(), this.compiler.postProjectTranspile.bind(this.compiler)));
                });
            } else {
                observer.complete();
            }

            // tslint:disable-next-line no-unused-expression
            return { unsubscribe: () => undefined };
        });
    }

    private internalTranspile(): CompileResult[] {

        const result = this.compiler.compile([this.options.entrypoint]);
        if (!result) {

            throw new Error("Error while transpiling your sourcecode!");
        }

        return result;
    }
}
