import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { BreakStatement } from "typescript";

export class Lua51BreakStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public breakStatement(node: BreakStatement): string {

        return "BreakStatement";
    }
}