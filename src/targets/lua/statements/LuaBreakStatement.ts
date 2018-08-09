import { Target } from "../../Target";
import * as ts from "typescript";
import { BaseTarget } from "../../BaseTarget";

export interface LuaBreakStatement extends BaseTarget, Target { }
export class LuaBreakStatement implements Partial<Target> {

    public transpileBreakStatement(node: ts.BreakStatement): string {

        return "BREAK";
    }
}
