import { PartialTranspiler, StatementTranspiler } from "../../../transpiler";
import { ExpressionStatement } from "typescript";

export class Lua51ExpressionStatement extends PartialTranspiler implements Partial<StatementTranspiler> {

    /**
     * @inheritdoc
     */
    public expressionStatement(node: ExpressionStatement): string {

        // just transpile the containing expression
        return this.transpiler.transpileNode(node.expression);
    }
}