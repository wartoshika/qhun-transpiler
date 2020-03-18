import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { DeleteExpression } from "typescript";

export class Lua51DeleteExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    /**
     * @inheritdoc
     */
    public deleteExpression(node: DeleteExpression): string {

        // nillify the expression
        const expression = this.transpiler.transpileNode(node.expression);
        return `${expression}»=»nil`;
    }
}