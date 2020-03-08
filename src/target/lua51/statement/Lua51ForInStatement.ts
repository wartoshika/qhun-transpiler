import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { ForInStatement } from "typescript";

export class Lua51ForInStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public forInStatement(node: ForInStatement): string {

        return "ForInStatement";
    }
}