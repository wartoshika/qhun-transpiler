import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaConditionalExpression extends BaseTarget, Target { }
export class LuaConditionalExpression implements Partial<Target> {

    public transpileConditionalExpression(node: ts.ConditionalExpression): string {

        return "CONDITIONAL_EXPRESSION";
    }
}
