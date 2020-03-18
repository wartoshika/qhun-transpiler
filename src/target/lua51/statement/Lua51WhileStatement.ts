import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { WhileStatement } from "typescript";

export class Lua51WhileStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public whileStatement(node: WhileStatement): string {

        // parse the condition
        const condition = this.transpiler.transpileNode(node.expression);

        // transpile the body
        const body = this.transpiler.addIntend(this.transpiler.transpileNode(node.statement));

        // put everything together
        return [
            `while ${condition} do`,
            body,
            `end`
        ].join(this.transpiler.break());
    }
}