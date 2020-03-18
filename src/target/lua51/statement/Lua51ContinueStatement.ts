import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { ContinueStatement } from "typescript";
import { UnsupportedNodeException } from "../../../exception/UnsupportedNodeException";

export class Lua51ContinueStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public continueStatement(node: ContinueStatement): string {

        this.transpiler.registerError({
            node: node,
            message: `The continue statement is unsupported in lua!`
        });
        return "[ERROR]";
    }
}