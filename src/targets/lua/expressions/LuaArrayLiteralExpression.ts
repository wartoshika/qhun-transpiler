import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaArrayLiteralExpression extends BaseTarget, Target { }
export class LuaArrayLiteralExpression implements Partial<Target> {

    public transpileArrayLiteralExpression(node: ts.ArrayLiteralExpression): string {

        return "ARRAY_LITERAL_EXPRESSION";
    }
}
