import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaTypeAssertion extends BaseTarget, Target { }
export class LuaTypeAssertion implements Partial<Target> {

    public transpileTypeAssertion(node: ts.TypeAssertion): string {

        return "TYPE_ASSERTION";
    }
}
