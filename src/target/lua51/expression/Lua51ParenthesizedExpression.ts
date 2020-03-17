import { PartialTranspiler } from "../../../transpiler/impl/PartialTranspiler";
import { ExpressionTranspiler } from "../../../transpiler";
import { ParenthesizedExpression, SyntaxKind } from "typescript";

export class Lua51ParenthesizedExpression extends PartialTranspiler implements Partial<ExpressionTranspiler> {

    /**
     * @inheritdoc
     */
    public parenthesizedExpression(node: ParenthesizedExpression): string {

        // transpile the expression first
        const expression = this.transpiler.transpileNode(node.expression);

        // if the wrapped expression is a AsExpression, dont use parenthes.
        // in every other case use them!
        if (node.expression.kind === SyntaxKind.AsExpression) {
            return expression;
        }

        // wrap the inner expression
        return `(»${expression}»)`;
    }
}