import { Reader } from "../Reader";
import { Project } from "../Project";
import * as path from "path";
import { ArgumentConfig } from "./ArgumentConfig";
import { DefaultConfig } from "../DefaultConfig";

export class ArgumentReader implements Reader {

    constructor(
        private args: { [P in keyof ArgumentConfig]?: ArgumentConfig[P] }
    ) { }

    /**
     * read the given arguments into a project object
     */
    public read(): Project {
        return DefaultConfig.mergeDefaultProjectData({
            target: this.args.target,
            rootDir: path.dirname(path.resolve(this.args.file)),
            outDir: ".",
            parsedCommandLine: {
                fileNames: [
                    this.args.file
                ],
                options: DefaultConfig.getDefaultCompilerOptions()
            }
        });
    }
}
