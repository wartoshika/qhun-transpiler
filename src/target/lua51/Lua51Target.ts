import { AbstractTarget } from "../../transpiler/impl/AbstractTarget";
import { Transpiler, Target, FileResult } from "../../transpiler";
import { Lua51Config } from "./Lua51Config";
import { OptionalConfigOfTarget } from "../../constraint";
import { Lua51Transpiler } from "./Lua51Transpiler";
import { TypeChecker, SourceFile } from "typescript";
import { Lua51Keywords } from "./Lua51Keywords";

export class Lua51Target extends AbstractTarget implements Target {

    private readonly EXPORT_LOCAL_NAME = this.transpiler.getConfig().obscurify ? Lua51Keywords.EXPORT_LOCAL_NAME_OBSCURIFY : Lua51Keywords.EXPORT_LOCAL_NAME;

    constructor(
        transpiler: Transpiler,
        config: Lua51Config,
        typeChecker: TypeChecker
    ) { super(transpiler, config, typeChecker); }

    public static transpilerClass = Lua51Transpiler;

    public static fillConfig(config: Lua51Config): Required<OptionalConfigOfTarget<Lua51Config>> {
        return {
            emitTypes: typeof config.emitTypes === "boolean" ? config.emitTypes : false
        };
    }

    /**
     * @inheritdoc
     */
    public getFileExtension(): string {
        return "lua";
    }

    /**
     * @inheritdoc
     */
    public isCaseSensitive(): boolean {
        return true;
    }

    /**
     * @inheritdoc
     */
    public afterFileTranspile(fileResult: FileResult, sourceFile: SourceFile, code: string): string {

        // @todo: namespace exports!

        // add file exports
        const exportNames = this.transpiler.getExports();

        // ignore exports if there arent any
        if (exportNames.length === 0) {
            return code;
        }

        // add exports after the code
        return [
            code,
            `local ${this.EXPORT_LOCAL_NAME}»=»{`,
            this.transpiler.addIntend(
                exportNames
                    .map(name => `${name}»=»${name}`)
                    .join("," + this.transpiler.break())
            ),
            `}`,
            `return ${this.EXPORT_LOCAL_NAME}`
        ].join(this.transpiler.break())
    }
}
