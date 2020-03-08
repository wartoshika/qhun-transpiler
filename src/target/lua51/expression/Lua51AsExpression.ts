import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { AsExpression } from "typescript";

export class Lua51AsExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    /**
     * @inheritdoc
     */
    public asExpression(node: AsExpression): string {

        // just transpile the expression, lua cannot cast
        return this.transpiler.transpileNode(node.expression);
    }
}