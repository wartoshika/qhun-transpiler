import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaBinaryExpression extends BaseTarget, Target { }
export class LuaBinaryExpression implements Partial<Target> {

    public transpileBinaryExpression(node: ts.BinaryExpression): string {

        return "BINARY_EXPRESSION";
    }
}
