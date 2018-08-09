import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaElementAccessExpression extends BaseTarget, Target { }
export class LuaElementAccessExpression implements Partial<Target> {

    public transpileElementAccessExpression(node: ts.ElementAccessExpression): string {

        return "ELEMENT_ACCESS_EXPRESSION";
    }
}
