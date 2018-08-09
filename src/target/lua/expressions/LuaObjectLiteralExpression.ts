import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaObjectLiteralExpression extends BaseTarget, Target { }
export class LuaObjectLiteralExpression implements Partial<Target> {

    public transpileObjectLiteralExpression(node: ts.ObjectLiteralExpression): string {

        return "OBJECT_LITERAL_EXPRESSION";
    }
}
