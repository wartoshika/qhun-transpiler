import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { ForOfStatement } from "typescript";

export class Lua51ForOfStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public forOfStatement(node: ForOfStatement): string {

        return "ForOfStatement";
    }
}