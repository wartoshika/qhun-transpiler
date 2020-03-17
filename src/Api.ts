import { TargetConstructor, ConfigOfTarget } from "./constraint";
import { Target, TranspileResult, TranspilerFactory } from "./transpiler";
import { Observable } from "rxjs";
import { createProgram, SourceFile } from "typescript";
import { Config } from "./Config";
import { NodeContainingException } from "./exception/NodeContainingException";
import { Obscurifier } from "./util/Obscurifier";
import { FileWriter } from "./util/FileWriter";

export class Api<I extends Target, T extends TargetConstructor<I>> {

    constructor(
        private target: T,
        private config: ConfigOfTarget<T>
    ) { }

    /**
     * transpiles the sourcecode using the given configuration
     */
    public transpile(): Observable<TranspileResult> {

        return new Observable(obs => {

            try {
                obs.next(this.internalTranspile());
                obs.complete();
            } catch (e) {
                console.error(`Error: ${e.message}`);
                console.error(e.stack);
            }
        });
    }

    private internalTranspile(): TranspileResult {

        // create transpiler and typescript relevant instances
        const filledConfig = this.fillConfig();
        const obscurifier = new Obscurifier();
        const program = createProgram([this.config.entryPoint], this.config.compilerOptions || {});
        const typeChecker = program.getTypeChecker();
        const transpiler = new TranspilerFactory().create(typeChecker, filledConfig, this.target.transpilerClass, obscurifier);
        const fileWriter = new FileWriter(module!.parent!.filename, filledConfig);

        // remove outputDir if available
        fileWriter.removeDestinationFolder();

        // create target
        const targetInstance = new this.target(transpiler, this.config, typeChecker);
        obscurifier.setCaseSensitive(targetInstance.isCaseSensitive());

        // update instances
        fileWriter.setFileExtension(targetInstance.getFileExtension());
        transpiler.setTarget(targetInstance);

        // iterate over source files
        program.getSourceFiles()
            // ignore declaration files
            .filter(file => !file.isDeclarationFile)
            .forEach(file => {

                console.log("File: ", file.fileName);
                transpiler.setSourceFile(file);
                NodeContainingException.currentSourceFile = file;

                const transpiledCode = targetInstance.transpileSourceFile(file);

                console.log(transpiledCode);
                fileWriter.writeTranspiledResult(transpiledCode, file);
            });

        return null!;
    }

    private fillConfig(): Required<Config> {

        return Object.assign(this.target.fillConfig(this.config), {
            compilerOptions: typeof this.config.compilerOptions === "object" && this.config.compilerOptions !== null ? this.config.compilerOptions : {},
            prettyPrint: typeof this.config.prettyPrint === "boolean" ? this.config.prettyPrint : true,
            intend: typeof this.config.intend === "number" && this.config.intend >= 0 ? this.config.intend : 2,
            obscurify: typeof this.config.obscurify === "boolean" ? this.config.obscurify : false,
            emitComments: typeof this.config.emitComments === "boolean" ? this.config.emitComments : true,
            ...this.config
        } as Required<Config>);
    }

}