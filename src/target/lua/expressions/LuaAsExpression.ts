import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaAsExpression extends BaseTarget, Target { }
export class LuaAsExpression implements Partial<Target> {

    public transpileAsExpression(node: ts.AsExpression): string {

        return "AS_EXPRESSION";
    }
}
