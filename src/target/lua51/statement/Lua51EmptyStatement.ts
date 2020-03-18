import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { EmptyStatement } from "typescript";

export class Lua51EmptyStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public emptyStatement(node: EmptyStatement): string {

        // an empty statement will result in an empty string
        return "";
    }
}