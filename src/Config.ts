import { CompilerOptions, Node } from "typescript";
import { AllTranspilers } from "./constraint";

export interface Config {

    /**
     * the absolute or relative path to your entry typescript file
     */
    entryPoint: string,

    /**
     * an absolute or relative path to the destination folder of the transpiled result
     */
    outputDir: string,

    /**
     * removes the directory name of the destination path where the source code is stored.
     * if you put all your code into `PROJECT_ROOT/src/Class.ts` you may set the property to `src`.
     * this will put the transpiled code into `PROJECT_ROOT/OUTPUT_DIR/Class.ts` instead of `PROJECT_ROOT/OUTPUT_DIR/src/Class.ts`.
     * @default undefined
     */
    outputRemoveSourceFolderName?: string | undefined,

    /**
     * declare your typescript compiler options when transpiling your sourcecode
     */
    compilerOptions?: CompilerOptions,

    /**
     * outputs the target source code formatted and human readable
     * @default true
     */
    prettyPrint?: boolean,

    /**
     * replaces all identifiers with short random names to recuse file output size
     * @default false
     */
    obscurify?: boolean,

    /**
     * when using pretty print this allows you to configure the whitespace intend of code blocks
     * @default 2
     * @validRange 0..infinity
     */
    intend?: number,

    /**
     * **Inactive: currently work in progress**
     * 
     * tries to read all comments and emit them in a possible way
     * @default true
     */
    emitComments?: boolean,

    /**
     * allows to add aditional functionality to the transpiling process by applying custom
     * code to each statement.
     * 
     * 
     * Parameters of the functions are:
     * - `node` the typescript node element to transpile.
     * - `transpileNode` a function that will transpile any kind of node to a string
     * - `originalFunction` the original transpiler function. can be used to get a transpiled result as string.
     */
    transform?: {
        [P in keyof AllTranspilers]?: (node: Parameters<AllTranspilers[P]>[0], transpileNode: (node: Node) => string, originalFunction: AllTranspilers[P]) => string
    }

}