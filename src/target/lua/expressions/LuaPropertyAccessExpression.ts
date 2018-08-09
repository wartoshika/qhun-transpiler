import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaPropertyAccessExpression extends BaseTarget, Target { }
export class LuaPropertyAccessExpression implements Partial<Target> {

    public transpilePropertyAccessExpression(node: ts.PropertyAccessExpression): string {

        return "PROPERTY_ACCESS_EXPRESSION";
    }
}
