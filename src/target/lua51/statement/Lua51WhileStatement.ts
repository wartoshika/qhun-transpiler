import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { WhileStatement } from "typescript";

export class Lua51WhileStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public whileStatement(node: WhileStatement): string {

        return "WhileStatement";
    }
}