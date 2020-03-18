import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { DoStatement } from "typescript";

export class Lua51DoStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public doStatement(node: DoStatement): string {

        // get the footer condition
        const condition = this.transpiler.transpileNode(node.expression);

        // get the body
        const body = this.transpiler.transpileNode(node.statement);

        // put everything together
        return [
            `repeat`,
            this.transpiler.addIntend(body),
            // the condition must be negated!
            `until not (»${condition}»)`
        ].join(this.transpiler.break());
    }
}