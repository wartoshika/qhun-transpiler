import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaParenthesizedExpression extends BaseTarget, Target { }
export class LuaParenthesizedExpression implements Partial<Target> {

    public transpileParenthesizedExpression(node: ts.ParenthesizedExpression): string {

        // transpile the expression first
        const expression = this.transpileNode(node.expression);

        // if the wrapped expression is a AsExpression, dont use parenthes.
        // in every other case use them!
        if (node.expression.kind === ts.SyntaxKind.AsExpression) {
            return expression;
        }

        // wrap the inner expression
        return `(${expression})`;
    }
}
