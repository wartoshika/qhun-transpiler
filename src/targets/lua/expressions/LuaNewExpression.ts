import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaNewExpression extends BaseTarget, Target { }
export class LuaNewExpression implements Partial<Target> {

    public transpileNewExpression(node: ts.NewExpression): string {

        return "NEW_EXPRESSION";
    }
}
