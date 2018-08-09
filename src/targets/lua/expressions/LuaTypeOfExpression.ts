import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaTypeOfExpression extends BaseTarget, Target { }
export class LuaTypeOfExpression implements Partial<Target> {

    public transpileTypeOfExpression(node: ts.TypeOfExpression): string {

        return "TYPEOF_EXPRESSION";
    }
}
