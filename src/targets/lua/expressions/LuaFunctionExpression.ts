import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaFunctionExpression extends BaseTarget, Target { }
export class LuaFunctionExpression implements Partial<Target> {

    public transpileFunctionExpression(node: ts.FunctionExpression | ts.ArrowFunction): string {

        return "FUNCTION_EXPRESSION";
    }
}
