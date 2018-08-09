import { Reader } from "./Reader";
import { Project } from "./Project";
import * as ts from "typescript";

export class ArgumentReader implements Reader {

    constructor(
        private args: { [P in keyof Project]?: Project[P] }
    ) { }

    /**
     * read the given arguments into a project object
     */
    public read(): Project {
        return {
            author: this.args.author || "Unknown",
            compilerOptions: {
                moduleResolution: ts.ModuleResolutionKind.NodeJs,
                target: ts.ScriptTarget.ES2015
            },
            config: {},
            description: this.args.description || "Unknown",
            entry: this.args.entry || "src/index.ts",
            licence: this.args.licence || "Unknown",
            name: this.args.name || "Unknown",
            outDir: this.args.outDir || "dist",
            printFileHeader: this.args.printFileHeader || true,
            target: this.args.target,
            version: this.args.version || "0.0.0"
        };
    }
}
