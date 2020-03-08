import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { ContinueStatement } from "typescript";

export class Lua51ContinueStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public continueStatement(node: ContinueStatement): string {

        return "ContinueStatement";
    }
}