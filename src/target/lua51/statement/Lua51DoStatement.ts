import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { DoStatement } from "typescript";

export class Lua51DoStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public doStatement(node: DoStatement): string {

        return "DoStatement";
    }
}