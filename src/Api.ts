import { TargetConstructor, ConfigOfTarget, TranspileMessage } from "./constraint";
import { Target, TranspileResult, TranspilerFactory, FileResult } from "./transpiler";
import { Observable } from "rxjs";
import { createProgram } from "typescript";
import { Config } from "./Config";
import { NodeContainingException } from "./exception/NodeContainingException";
import { Obscurifier } from "./util/Obscurifier";
import { FileWriter } from "./util/FileWriter";
import { tap, catchError } from "rxjs/operators";
import { Output } from "./util/Output";
import { PathUtil } from "./util/PathUtil";

export class Api<I extends Target, T extends TargetConstructor<I>> {

    constructor(
        private target: T,
        private config: ConfigOfTarget<T>
    ) { }

    /**
     * transpiles the sourcecode using the given configuration
     * @param operatorFun allows to change the behaviour after one batch of files have been transpiled
     */
    public transpile(operatorFun?: (observable: Observable<TranspileResult>) => Observable<TranspileResult>): void {

        const internalOperatorFun = typeof operatorFun === "function" ? operatorFun : this.finalize;

        // print welcome info
        Output.welcome();

        new Observable(obs => {
            try {
                obs.next(this.internalTranspile());
                obs.complete();
            } catch (e) {
                obs.error(e);
            }
        })
            .pipe(internalOperatorFun)
            .subscribe();

    }

    private internalTranspile(): TranspileResult {

        // create transpiler and typescript relevant instances
        const filledConfig = this.fillConfig();
        const obscurifier = new Obscurifier();
        const program = createProgram([this.config.entryPoint], this.config.compilerOptions || {});
        const typeChecker = program.getTypeChecker();
        const transpiler = new TranspilerFactory().create(typeChecker, filledConfig, this.target.transpilerClass, obscurifier);
        const fileWriter = new FileWriter(filledConfig);
        const transpileWarnings: TranspileMessage[] = [];
        const transpileErrors: TranspileMessage[] = [];
        let transpileResult = new TranspileResult(fileWriter, () => transpileWarnings, () => transpileErrors);

        // create target
        const targetInstance = new this.target(transpiler, this.config, typeChecker);
        obscurifier.setCaseSensitive(targetInstance.isCaseSensitive());

        // update instances
        fileWriter.setFileExtension(targetInstance.getFileExtension());
        transpiler.setTarget(targetInstance);

        // execute before batch
        if (typeof targetInstance.beforeBatch === "function") {
            targetInstance.beforeBatch();
        }

        // iterate over source files
        program.getSourceFiles()
            // ignore declaration files
            .filter(file => !file.isDeclarationFile)
            .forEach(file => {

                // execute before file
                if (typeof targetInstance.beforeFileTranspile === "function") {
                    file = targetInstance.beforeFileTranspile(file);
                }

                transpiler.setSourceFile(file);
                NodeContainingException.currentSourceFile = file;

                let transpiledCode = targetInstance.transpileSourceFile(file);
                const destinationPath = fileWriter.getFileDestination(file);

                // get warnings
                const fileWarnings = transpiler.getWarnings();
                const hasWarnings = fileWarnings.length > transpileWarnings.length;
                transpileWarnings.push(...fileWarnings);

                // get errors
                const filErrors = transpiler.getErrors();
                const hasErrors = filErrors.length > transpileErrors.length;
                transpileErrors.push(...filErrors);

                // build file result
                const fileResult: FileResult = {
                    sourceFile: file,
                    originalFilePath: PathUtil.resolveNormalize(file.fileName),
                    originalFileName: PathUtil.filename(file.fileName),
                    newFilePath: destinationPath,
                    newFileName: PathUtil.filename(destinationPath),
                    transpiledCode: transpiledCode,
                    hasErrors, hasWarnings
                };

                // execute after file
                if (typeof targetInstance.afterFileTranspile === "function") {
                    fileResult.transpiledCode = targetInstance.afterFileTranspile(fileResult, file, transpiledCode);
                }

                // replace constants
                fileResult.transpiledCode = targetInstance.replaceMagicConstants(fileResult.transpiledCode);

                // add transpiled result to the result stack
                transpileResult.addFile(fileResult);
            });

        // execute after batch
        if (typeof targetInstance.afterBatch === "function") {
            transpileResult = targetInstance.afterBatch(transpileResult);
        }

        return transpileResult;
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

    private finalize(observable: Observable<TranspileResult>): Observable<TranspileResult> {

        return observable.pipe(
            tap(result => {
                result.checkForErrors();
                result.persist();
                result.printStatistic();
            }),
            catchError((e, c) => {

                Output.pipelineError(e);
                process.exit(1);
                return c;
            })
        )
    }
}