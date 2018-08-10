import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaParenthesizedExpression extends BaseTarget, Target { }
export class LuaParenthesizedExpression implements Partial<Target> {

    public transpileParenthesizedExpression(node: ts.ParenthesizedExpression): string {

        // wrap the inner expression
        const expression = this.transpileNode(node.expression);
        return `(${expression})`;
    }
}
