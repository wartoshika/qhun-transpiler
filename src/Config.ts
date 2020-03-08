import { CompilerOptions } from "typescript";

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
    intend?: number

}