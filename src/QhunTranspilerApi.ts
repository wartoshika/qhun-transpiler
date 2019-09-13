import { ApiOptions } from "./api/ApiOptions";
import { Compiler } from "./compiler/Compiler";
import { FileWatcher } from "./cli/FileWatcher";
import { DefaultConfig } from "./config/DefaultConfig";
import { SupportedTargets } from "./target/TargetFactory";

export class QhunTranspilerApi<T extends keyof SupportedTargets> {

    /**
     * the currently used compiler instance
     */
    private compiler: Compiler;

    constructor(
        target: T,
        private readonly options: ApiOptions<T> = {}
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
    public transpile(): string[] {

        // build project
        const project = DefaultConfig.apiOptionsToProject(this.options);

        // construct the compiler
        this.compiler = new Compiler(project);

        // bind watcher if actiavted
        if (this.options.watch) {

            // tslint:disable-next-line no-unused-expression
            new FileWatcher(project, this.internalTranspile.bind(this));
        }

        // other work will be done by the internal transpiler
        return this.internalTranspile();
    }

    private internalTranspile(): string[] {

        this.compiler.compile([]);
        return [];
    }
}
