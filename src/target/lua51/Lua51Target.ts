import { AbstractTarget } from "../../transpiler/impl/AbstractTarget";
import { Transpiler } from "../../transpiler";
import { Lua51Config } from "./Lua51Config";
import { Class, OptionalConfigOfTarget } from "../../constraint";
import { Lua51Transpiler } from "./Lua51Transpiler";
import { TypeChecker } from "typescript";

export class Lua51Target extends AbstractTarget {

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
}
