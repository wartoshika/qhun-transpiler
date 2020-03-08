import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { EmptyStatement } from "typescript";

export class Lua51EmptyStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public emptyStatement(node: EmptyStatement): string {

        // empty statement is ..... empty
        return "EMPTY";
    }
}