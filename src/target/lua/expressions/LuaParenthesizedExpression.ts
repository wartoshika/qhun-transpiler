import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaParenthesizedExpression extends BaseTarget, Target { }
export class LuaParenthesizedExpression implements Partial<Target> {

    public transpileParenthesizedExpression(node: ts.ParenthesizedExpression): string {

        return "Parenthesized_EXPRESSION";
    }
}
