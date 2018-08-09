import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaDeleteExpression extends BaseTarget, Target { }
export class LuaDeleteExpression implements Partial<Target> {

    public transpileDeleteExpression(node: ts.DeleteExpression): string {

        return "DELETE_EXPRESSION";
    }
}
