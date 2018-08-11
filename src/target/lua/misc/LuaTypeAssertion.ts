import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaTypeAssertion extends BaseTarget, Target { }
export class LuaTypeAssertion implements Partial<Target> {

    public transpileTypeAssertion(node: ts.TypeAssertion): string {

        // just transpile the expression, lua does not know types
        return this.transpileNode(node.expression);
    }
}
