import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaPostfixUnaryExpression extends BaseTarget, Target { }
export class LuaPostfixUnaryExpression implements Partial<Target> {

    public transpilePostfixUnaryExpression(node: ts.PostfixUnaryExpression): string {

        return "POSTFIX_UNARY";
    }
}
