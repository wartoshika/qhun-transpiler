import { Config } from "../../Config";
import { Target } from "../Target";
import { Transpiler } from "../Transpiler";
import { TypeChecker, SourceFile } from "typescript";

export abstract class AbstractTarget implements Target {

    private readonly MAGIC_OPTIONAL_SPACE_CHAR = "»";

    constructor(
        protected transpiler: Transpiler,
        protected config: Config,
        protected typeChecker: TypeChecker
    ) { }

    /**
     * @inheritdoc
     */
    public abstract getFileExtension(): string;

    /**
     * @inheritdoc
     */
    public abstract isCaseSensitive(): boolean;

    /**
     * @inheritdoc
     */
    public transpileSourceFile(file: SourceFile): string {

        return file.statements.map(
            statement => this.transpiler.transpileNode(statement)
        ).join(this.transpiler.break());
    }

    /**
     * @inheritdoc
     */
    public replaceMagicConstants(code: string): string {

        return code.replace(new RegExp(`\\${this.MAGIC_OPTIONAL_SPACE_CHAR}`, "g"), this.transpiler.space());
    }

}