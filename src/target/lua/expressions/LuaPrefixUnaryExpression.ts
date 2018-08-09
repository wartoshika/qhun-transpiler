import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaPrefixUnaryExpression extends BaseTarget, Target { }
export class LuaPrefixUnaryExpression implements Partial<Target> {

    public transpilePrefixUnaryExpression(node: ts.PrefixUnaryExpression): string {

        return "PREFIX_UNARY_EXPRESSION";
    }
}
